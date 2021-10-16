import { AppDispatch, store, RootState } from '../app/store'
import { AsyncThunkAction } from '@reduxjs/toolkit'
import { AppSelector } from '../app/hooks'
import { getGovernorInfo, governorInfo, governorArgs } from './governor'
import { getMarketInfo, marketArgs, marketInfo } from './market'
import { getRatesInfo, ratesInfo, ratesArgs } from './rates'
import { balanceInfo } from './balances'
import { getHueBalance, hueBalanceArgs } from './balances/hueBalance'
import { getPoolMetadata, getPoolMetadataArgs, poolsInfo } from './poolMetadata'
import { getLendHueBalance, lendHueBalanceArgs } from './balances/lendHueBalance'
import { getLiquidityPositions, liquidityPositionsArgs, liquidityPositions } from './liquidityPositions'
import { getPositions, positionsInfo, positionsArgs } from './positions'
import { getProposals, proposalsInfo, proposalsArgs } from './proposals'
import { getSystemDebtInfo, systemDebtInfo, systemDebtArgs } from './systemDebt'
import { getLiquidationsInfo, liquidationsArgs, liquidationsInfo } from './liquidations'
import { getPricesInfo, pricesInfo, pricesArgs } from './prices'
import { ethBalance, ethBalanceArgs, fetchEthBalance } from './ethBalance'
import { ProtocolContract, getGovernorContract, getProtocolDataAggregatorContract, getContractArgs, getContractThunk, getContractReturnType, getTrustlessMulticallContract, getSingleContractArgs } from './contracts'

import { sliceState } from './'

enum FetchNode {
  ChainID,
  GovernorInfo,
  LiquidationsInfo,
  MarketInfo,
  RatesInfo,
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

const getWaitFunction = <Args extends {}, Value>(
  stateSelector: (state: RootState) => sliceState<Value>,
  thunk: (args: Args) => AsyncThunkAction<Value | null, Args, {}>,
  fetchNodes: (FetchNode | ProtocolContract) [],
) => (
  selector: AppSelector,
  dispatch: AppDispatch
) => {
  const state = selector(stateSelector)

  let inputArgs = {}
  fetchNodes.map(fetchNode => {
    const fetchedNode = getNodeFetch(fetchNode, selector, dispatch)
    inputArgs = {...inputArgs, ...fetchedNode}
  })

  if (Object.values(inputArgs).includes(null)) return null

  const error = state.data.error
  if (error !== null) {
    console.error(error.message)
    throw state.data.error
  }

  if (state.data.value === null && !stateSelector(store.getState()).loading) {
    dispatch(thunk(inputArgs as NonNullable<Args>))
  }

  return state.data.value
}

/// ============================ Get Contracts Logic =======================================
export const waitForGovernorContract = getWaitFunction<getSingleContractArgs, getContractReturnType>(
  (state: RootState) => state.contracts[ProtocolContract.Governor],
  getGovernorContract,
  [FetchNode.ChainID],
)

export const waitForTrustlessMulticallContract = getWaitFunction<getSingleContractArgs, getContractReturnType>(
  (state: RootState) => state.contracts[ProtocolContract.TrustlessMulticall],
  getTrustlessMulticallContract,
  [FetchNode.ChainID],
)

export const waitForProtocolDataAggregator = getWaitFunction<getSingleContractArgs, getContractReturnType>(
  (state: RootState) => state.contracts[ProtocolContract.ProtocolDataAggregator],
  getProtocolDataAggregatorContract,
  [FetchNode.ChainID],
)

export const getContractWaitFunction = (protocolContract: ProtocolContract) => getWaitFunction<getContractArgs, getContractReturnType>(
  (state: RootState) => state.contracts[protocolContract],
  getContractThunk(protocolContract),
  [ProtocolContract.Governor]
)

/// ============================ Get Info Logic =======================================
export const waitForGovernor = getWaitFunction<governorArgs, governorInfo>(
  (state: RootState) => state.governor,
  getGovernorInfo,
  [ProtocolContract.Governor],
)

export const waitForPrices = getWaitFunction<pricesArgs, pricesInfo>(
  (state: RootState) => state.prices,
  getPricesInfo,
  [ProtocolContract.Prices, FetchNode.LiquidationsInfo, ProtocolContract.TrustlessMulticall],
)

export const waitForMarket = getWaitFunction<marketArgs, marketInfo>(
  (state: RootState) => state.market,
  getMarketInfo,
  [ProtocolContract.Market, ProtocolContract.TrustlessMulticall],
)

export const waitForPositions = getWaitFunction<positionsArgs, positionsInfo>(
  (state: RootState) => state.positions,
  getPositions,
  [FetchNode.UserAddress, FetchNode.SDI, FetchNode.MarketInfo, ProtocolContract.Accounting, ProtocolContract.HuePositionNFT, ProtocolContract.TrustlessMulticall],
)

export const waitForProposals = getWaitFunction<proposalsArgs, proposalsInfo>(
  (state: RootState) => state.proposals,
  getProposals,
  [ProtocolContract.TcpGovernorAlpha, FetchNode.UserAddress],
)

export const waitForLiquidations = getWaitFunction<liquidationsArgs, liquidationsInfo>(
  (state: RootState) => state.liquidations,
  getLiquidationsInfo,
  [ProtocolContract.Liquidations, ProtocolContract.TrustlessMulticall],
)

export const waitForRates = getWaitFunction<ratesArgs, ratesInfo>(
  (state: RootState) => state.rates,
  getRatesInfo,
  [ProtocolContract.Rates, ProtocolContract.TrustlessMulticall],
)

export const waitForSDI = getWaitFunction<systemDebtArgs, systemDebtInfo>(
  (state: RootState) => state.systemDebt,
  getSystemDebtInfo,
  [ProtocolContract.Accounting],
)

export const waitForHueBalance = getWaitFunction<hueBalanceArgs, balanceInfo>(
  (state: RootState) => state.hueBalance,
  getHueBalance,
  [ProtocolContract.Hue, FetchNode.UserAddress, ProtocolContract.TrustlessMulticall, ProtocolContract.Market, ProtocolContract.Accounting],
)

export const waitForLendHueBalance = getWaitFunction<lendHueBalanceArgs, balanceInfo>(
  (state: RootState) => state.lendHueBalance,
  getLendHueBalance,
  [ProtocolContract.LendHue, FetchNode.UserAddress, ProtocolContract.Market, ProtocolContract.TrustlessMulticall],
)

export const waitForEthBalance = getWaitFunction<ethBalanceArgs, ethBalance>(
  (state: RootState) => state.ethBalance,
  fetchEthBalance,
  [FetchNode.UserAddress, ProtocolContract.TrustlessMulticall],
)

export const waitForLiquidityPositions = getWaitFunction<liquidityPositionsArgs, liquidityPositions>(
  (state: RootState) => state.liquidityPositions,
  getLiquidityPositions,
  [FetchNode.UserAddress, ProtocolContract.Accounting, ProtocolContract.Rewards, ProtocolContract.TrustlessMulticall],
)

export const waitForPoolMetadata = getWaitFunction<getPoolMetadataArgs, poolsInfo>(
  (state: RootState) => state.poolMetadata,
  getPoolMetadata,
  [ProtocolContract.ProtocolDataAggregator, ProtocolContract.TrustlessMulticall],
)
