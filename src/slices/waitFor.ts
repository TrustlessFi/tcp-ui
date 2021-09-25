import { AppDispatch, store, RootState } from '../app/store'
import { AsyncThunkAction } from '@reduxjs/toolkit'
import { AppSelector } from '../app/hooks'
import { getGovernorInfo, governorInfo, governorArgs } from './governor'
import { getMarketInfo, marketArgs, marketInfo } from './market'
import { getRatesInfo, ratesInfo, ratesArgs } from './rates'
import { balanceInfo } from './balances'
import { getHueBalance, hueBalanceArgs } from './balances/hueBalance'
import { getLendHueBalance, lendHueBalanceArgs } from './balances/lendHueBalance'
import { getPositions, positionsInfo, positionsArgs } from './positions'
import { getProposals, proposalsInfo, proposalsArgs } from './proposals'
import { getSystemDebtInfo, systemDebtInfo, systemDebtArgs } from './systemDebt'
import { getLiquidationsInfo, liquidationsArgs, liquidationsInfo } from './liquidations'
import { getPricesInfo, pricesInfo, pricesArgs } from './prices'
import { ethBalance, ethBalanceArgs, fetchEthBalance } from './ethBalance'
import { ProtocolContract, getGovernorContract, getContractArgs, getContractThunk, getContractReturnType, getTcpMulticallContract, getSingleContractArgs } from './contracts'

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
    case ProtocolContract.TcpMulticall:
      return {[ProtocolContract.TcpMulticall]: waitForTcpMulticallContract(selector, dispatch)}

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

export const waitForTcpMulticallContract = getWaitFunction<getSingleContractArgs, getContractReturnType>(
  (state: RootState) => state.contracts[ProtocolContract.TcpMulticall],
  getTcpMulticallContract,
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
  [ProtocolContract.Prices, FetchNode.LiquidationsInfo, ProtocolContract.TcpMulticall],
)

export const waitForMarket = getWaitFunction<marketArgs, marketInfo>(
  (state: RootState) => state.market,
  getMarketInfo,
  [ProtocolContract.Market, ProtocolContract.TcpMulticall],
)

export const waitForPositions = getWaitFunction<positionsArgs, positionsInfo>(
  (state: RootState) => state.positions,
  getPositions,
  [FetchNode.UserAddress, FetchNode.SDI, FetchNode.MarketInfo, ProtocolContract.Accounting, ProtocolContract.HuePositionNFT, ProtocolContract.TcpMulticall],
)

export const waitForProposals = getWaitFunction<proposalsArgs, proposalsInfo>(
  (state: RootState) => state.proposals,
  getProposals,
  [ProtocolContract.TcpGovernorAlpha, FetchNode.UserAddress],
)

export const waitForLiquidations = getWaitFunction<liquidationsArgs, liquidationsInfo>(
  (state: RootState) => state.liquidations,
  getLiquidationsInfo,
  [ProtocolContract.Liquidations, ProtocolContract.TcpMulticall],
)

export const waitForRates = getWaitFunction<ratesArgs, ratesInfo>(
  (state: RootState) => state.rates,
  getRatesInfo,
  [ProtocolContract.Rates, ProtocolContract.TcpMulticall],
)

export const waitForSDI = getWaitFunction<systemDebtArgs, systemDebtInfo>(
  (state: RootState) => state.systemDebt,
  getSystemDebtInfo,
  [ProtocolContract.Accounting],
)

export const waitForHueBalance = getWaitFunction<hueBalanceArgs, balanceInfo>(
  (state: RootState) => state.hueBalance,
  getHueBalance,
  [ProtocolContract.Hue, FetchNode.UserAddress, ProtocolContract.TcpMulticall, ProtocolContract.Market, ProtocolContract.Accounting],
)

export const waitForLendHueBalance = getWaitFunction<lendHueBalanceArgs, balanceInfo>(
  (state: RootState) => state.hueBalance,
  getLendHueBalance,
  [ProtocolContract.LendHue, FetchNode.UserAddress, ProtocolContract.Market, ProtocolContract.TcpMulticall],
)

export const waitForEthBalance = getWaitFunction<ethBalanceArgs, ethBalance>(
  (state: RootState) => state.ethBalance,
  fetchEthBalance,
  [FetchNode.UserAddress, ProtocolContract.TcpMulticall],
)
