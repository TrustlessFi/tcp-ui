import { AppDispatch, store, RootState } from '../app/store'
import { AsyncThunkAction } from '@reduxjs/toolkit'
import { AppSelector } from '../app/hooks'
import { getGovernorInfo } from './governor'
import { getMarketInfo } from './market'
import { getRatesInfo } from './rates'
import { getHueBalance } from './balances/hueBalance'
import { getPoolsMetadata } from './poolsMetadata'
import { getLendHueBalance } from './balances/lendHueBalance'
import { getLiquidityPositions } from './liquidityPositions'
import { getPositions } from './positions'
import { getProposals } from './proposals'
import { getSystemDebtInfo } from './systemDebt'
import { getLiquidationsInfo } from './liquidations'
import { getRewardsInfo } from './rewards'
import { getPricesInfo } from './prices'
import { fetchEthBalance } from './ethBalance'
import { getPoolCurrentData } from './poolCurrentData'

import { ProtocolContract, getGovernorContract, getProtocolDataAggregatorContract, getContractThunk, getTrustlessMulticallContract } from './contracts'

import { sliceState } from './'

enum FetchNode {
  ChainID,
  GovernorInfo,
  LiquidationsInfo,
  RewardsInfo,
  MarketInfo,
  RatesInfo,
  PoolsMetadata,
  SDI,
  UserAddress,
}

const isProtocolContract = (s: string | number): s is ProtocolContract => s in ProtocolContract

const getNodeFetch = (
  fetchNode: FetchNode | ProtocolContract,
  selector: AppSelector,
  dispatch: AppDispatch,
) => {
  switch(fetchNode) {
    case FetchNode.ChainID:
      return {chainID: selector(state => state.chainID.chainID)}
    case FetchNode.GovernorInfo:
      return {governorInfo: waitForGovernor(selector, dispatch)}
    case FetchNode.LiquidationsInfo:
      return {liquidationsInfo: waitForLiquidations(selector, dispatch)}
    case FetchNode.RewardsInfo:
      return {rewardsInfo: waitForRewards(selector, dispatch)}
    case FetchNode.PoolsMetadata:
      return {PoolsMetadata: waitForPoolsMetadata(selector, dispatch)}
    case FetchNode.MarketInfo:
      return {marketInfo: waitForMarket(selector, dispatch)}
    case FetchNode.RatesInfo:
      return {ratesInfo: waitForRates(selector, dispatch)}
    case FetchNode.SDI:
      return {sdi: waitForSDI(selector, dispatch)}
    case FetchNode.UserAddress:
      return {userAddress: selector(state => state.wallet.address)}

    case ProtocolContract.Governor:
      return {[ProtocolContract.Governor]: waitForGovernorContract(selector, dispatch)}
    case ProtocolContract.TrustlessMulticall:
      return {[ProtocolContract.TrustlessMulticall]: waitForTrustlessMulticallContract(selector, dispatch)}
    case ProtocolContract.ProtocolDataAggregator:
      return {[ProtocolContract.ProtocolDataAggregator]: waitForProtocolDataAggregator(selector, dispatch)}

    default:
      if (!isProtocolContract(fetchNode)) throw new Error('Missing fetchNode ' + fetchNode)
      return {[fetchNode]: getContractWaitFunction(fetchNode)(selector, dispatch)}
  }
}

const getWaitFunction = <Args extends {}, Value, AdditionalData extends {}>(
  stateSelector: (state: RootState) => sliceState<Value>,
  thunk: (args: Args) => AsyncThunkAction<Value | null, Args, {}>,
  fetchNodes: (FetchNode | ProtocolContract) [],
  additionalData?: AdditionalData,
) => (
  selector: AppSelector,
  dispatch: AppDispatch
) => {
  const state = selector(stateSelector)

  let inputArgs = additionalData === undefined ? {} : {...additionalData}
  fetchNodes.map(fetchNode => {
    const fetchedNode = getNodeFetch(fetchNode, selector, dispatch)
    inputArgs = {...inputArgs, ...fetchedNode}
  })

  if (Object.values(inputArgs).includes(null)) return null

  if (state !== undefined && state.data.error !== null) {
    console.error(state.data.error.message)
    throw state.data.error
  }

  if (state === undefined || (state.data.value === null && !stateSelector(store.getState()).loading)) {
    dispatch(thunk(inputArgs as NonNullable<Args>))
  }

  return state === undefined ? null : state.data.value
}

/// ============================ Get Contracts Logic =======================================
export const waitForGovernorContract = getWaitFunction(
  (state: RootState) => state.contracts[ProtocolContract.Governor],
  getGovernorContract,
  [FetchNode.ChainID],
)

export const waitForTrustlessMulticallContract = getWaitFunction(
  (state: RootState) => state.contracts[ProtocolContract.TrustlessMulticall],
  getTrustlessMulticallContract,
  [FetchNode.ChainID],
)

export const waitForProtocolDataAggregator = getWaitFunction(
  (state: RootState) => state.contracts[ProtocolContract.ProtocolDataAggregator],
  getProtocolDataAggregatorContract,
  [FetchNode.ChainID],
)

export const getContractWaitFunction = (protocolContract: ProtocolContract) => getWaitFunction(
  (state: RootState) => state.contracts[protocolContract],
  getContractThunk(protocolContract),
  [ProtocolContract.Governor]
)

export const getPoolCurrentDataWaitFunction = (poolAddress: string) => getWaitFunction(
  (state: RootState) => state.poolCurrentData[poolAddress],
  getPoolCurrentData,
  [
    ProtocolContract.Rewards,
    ProtocolContract.Prices,
    ProtocolContract.TrustlessMulticall,
    FetchNode.UserAddress,
    FetchNode.RewardsInfo,
    FetchNode.PoolsMetadata,
  ],
  {poolAddress},
)

/// ============================ Get Info Logic =======================================
export const waitForGovernor = getWaitFunction(
  (state: RootState) => state.governor,
  getGovernorInfo,
  [ProtocolContract.Governor],
)

export const waitForPrices = getWaitFunction(
  (state: RootState) => state.prices,
  getPricesInfo,
  [ProtocolContract.Prices, FetchNode.LiquidationsInfo, ProtocolContract.TrustlessMulticall],
)

export const waitForMarket = getWaitFunction(
  (state: RootState) => state.market,
  getMarketInfo,
  [ProtocolContract.Market, ProtocolContract.TrustlessMulticall],
)

export const waitForPositions = getWaitFunction(
  (state: RootState) => state.positions,
  getPositions,
  [FetchNode.UserAddress, FetchNode.SDI, FetchNode.MarketInfo, ProtocolContract.Accounting, ProtocolContract.HuePositionNFT, ProtocolContract.TrustlessMulticall],
)

export const waitForProposals = getWaitFunction(
  (state: RootState) => state.proposals,
  getProposals,
  [ProtocolContract.TcpGovernorAlpha, FetchNode.UserAddress],
)

export const waitForLiquidations = getWaitFunction(
  (state: RootState) => state.liquidations,
  getLiquidationsInfo,
  [ProtocolContract.Liquidations, ProtocolContract.TrustlessMulticall],
)

export const waitForRewards = getWaitFunction(
  (state: RootState) => state.rewards,
  getRewardsInfo,
  [ProtocolContract.Rewards, ProtocolContract.TrustlessMulticall],
)

export const waitForRates = getWaitFunction(
  (state: RootState) => state.rates,
  getRatesInfo,
  [ProtocolContract.Rates, ProtocolContract.TrustlessMulticall],
)

export const waitForSDI = getWaitFunction(
  (state: RootState) => state.systemDebt,
  getSystemDebtInfo,
  [ProtocolContract.Accounting],
)

export const waitForHueBalance = getWaitFunction(
  (state: RootState) => state.hueBalance,
  getHueBalance,
  [ProtocolContract.Hue, FetchNode.UserAddress, ProtocolContract.TrustlessMulticall, ProtocolContract.Market, ProtocolContract.Accounting],
)

export const waitForLendHueBalance = getWaitFunction(
  (state: RootState) => state.lendHueBalance,
  getLendHueBalance,
  [ProtocolContract.LendHue, FetchNode.UserAddress, ProtocolContract.Market, ProtocolContract.TrustlessMulticall],
)

export const waitForEthBalance = getWaitFunction(
  (state: RootState) => state.ethBalance,
  fetchEthBalance,
  [FetchNode.UserAddress, ProtocolContract.TrustlessMulticall],
)

export const waitForLiquidityPositions = getWaitFunction(
  (state: RootState) => state.liquidityPositions,
  getLiquidityPositions,
  [FetchNode.UserAddress, ProtocolContract.Accounting, ProtocolContract.TrustlessMulticall],
)

export const waitForPoolsMetadata = getWaitFunction(
  (state: RootState) => state.poolsMetadata,
  getPoolsMetadata,
  [ProtocolContract.ProtocolDataAggregator, ProtocolContract.TrustlessMulticall, ProtocolContract.Rewards, FetchNode.UserAddress],
)
