import { AppDispatch, store, RootState } from './../app/store'
import { AsyncThunkAction } from '@reduxjs/toolkit'
import { AppSelector } from './../app/hooks'
import { getGovernorInfo, governorInfo, governorArgs } from './governor'
import { getMarketInfo, marketArgs, marketInfo } from './market'
import { getRatesInfo, ratesInfo, ratesArgs } from './rates'
import { getReferenceTokens, referenceTokens, referenceTokenArgs } from './referenceTokens'
import { getReferenceTokenBalances, referenceTokenBalances, referenceTokenBalancesArgs } from './balances/referenceTokenBalances'
import { balanceInfo, balanceState, fetchTokenBalanceArgs } from './balances'
import { getHueBalance } from './balances/hueBalance'
import { getLendHueBalance } from './balances/lendHueBalance'
import { getPositions, positionsInfo, positionsArgs } from './positions'
import { getSystemDebtInfo, systemDebtInfo, systemDebtArgs } from './systemDebt'
import { getLiquidationsInfo, liquidationsArgs, liquidationsInfo } from './liquidations'
import { sliceState } from './'
import { Nullable } from '../utils'

import { getPricesInfo, pricesInfo, pricesArgs } from './prices/index'


enum FetchNode {
  ChainID,
  TokenAddresses,
  UserAddress,
  MarketInfo,
  GovernorInfo,
  LiquidationsInfo,
  SDI,
}

const getNodeFetch = (
  fetchNode: FetchNode,
  selector: AppSelector,
  dispatch: AppDispatch,
) => {
  switch(fetchNode) {
    case FetchNode.ChainID:
      return {chainID: selector(state => state.chainID.chainID)}
    case FetchNode.TokenAddresses:
      return {tokenAddresses: waitForReferenceTokens(selector, dispatch)}
    case FetchNode.UserAddress:
      return {userAddress: selector(state => state.wallet.address)}
    case FetchNode.MarketInfo:
      return {marketInfo: waitForMarket(selector, dispatch)}
    case FetchNode.GovernorInfo:
      return {governorInfo: waitForGovernor(selector, dispatch)}
    case FetchNode.LiquidationsInfo:
      return {liquidationsInfo: waitForLiquidations(selector, dispatch)}
    case FetchNode.SDI:
      return {sdi: waitForSDI(selector, dispatch)}
  }
}

const getWaitFunction = <Args extends {}, Value>(
  stateSelector: (state: RootState) => sliceState<Value>,
  thunk: (args: Args) => AsyncThunkAction<Value | null, Args, {}>,
  fetchNodes: FetchNode[],
) => (
  selector: AppSelector,
  dispatch: AppDispatch
) => {
  const state = selector(stateSelector)

  let inputArgs = {}
  fetchNodes.map(fetchNode => {
    const fetchedNode = getNodeFetch(fetchNode, selector, dispatch)
    inputArgs = { ...inputArgs, ...fetchedNode}
  })

  if (Object.values(inputArgs).includes(null)) return null

  const error = state.data.error
  if (error !== null) {
    console.error(error.message)
    throw error.message
  }
  if (state.data.value === null && !stateSelector(store.getState()).loading) {
    dispatch(thunk(inputArgs as NonNullable<Args>))
  }
  return state.data.value
}

export const waitForGovernor = getWaitFunction<governorArgs, governorInfo>(
  (state: RootState) => state.governor,
  getGovernorInfo,
  [FetchNode.ChainID],
)

export const waitForPrices = getWaitFunction<pricesArgs, pricesInfo>(
  (state: RootState) => state.prices,
  getPricesInfo,
  [FetchNode.ChainID, FetchNode.GovernorInfo, FetchNode.LiquidationsInfo],
)

export const waitForMarket = getWaitFunction<marketArgs, marketInfo>(
  (state: RootState) => state.market,
  getMarketInfo,
  [FetchNode.ChainID],
)

export const waitForPositions = getWaitFunction<positionsArgs, positionsInfo>(
  (state: RootState) => state.positions,
  getPositions,
  [FetchNode.ChainID, FetchNode.UserAddress, FetchNode.SDI, FetchNode.MarketInfo],
)

export const waitForLiquidations = getWaitFunction<liquidationsArgs, liquidationsInfo>(
  (state: RootState) => state.liquidations,
  getLiquidationsInfo,
  [FetchNode.ChainID],
)

export const waitForRates = getWaitFunction<ratesArgs, ratesInfo>(
  (state: RootState) => state.rates,
  getRatesInfo,
  [FetchNode.ChainID],
)

export const waitForSDI = getWaitFunction<systemDebtArgs, systemDebtInfo>(
  (state: RootState) => state.systemDebt,
  getSystemDebtInfo,
  [FetchNode.ChainID],
)

export const waitForReferenceTokens = getWaitFunction<referenceTokenArgs, referenceTokens>(
  (state: RootState) => state.referenceTokens,
  getReferenceTokens,
  [FetchNode.ChainID, FetchNode.GovernorInfo],
)

export const waitForHueBalance = getWaitFunction<fetchTokenBalanceArgs, balanceInfo>(
  (state: RootState) => state.hueBalance,
  getHueBalance,
  [FetchNode.ChainID, FetchNode.UserAddress],
)

export const waitForLendHueBalance = getWaitFunction<fetchTokenBalanceArgs, balanceInfo>(
  (state: RootState) => state.hueBalance,
  getLendHueBalance,
  [FetchNode.ChainID, FetchNode.UserAddress],
)

export const waitForReferenceTokenBalances = getWaitFunction<referenceTokenBalancesArgs, referenceTokenBalances>(
  (state: RootState) => state.referenceTokenBalances,
  getReferenceTokenBalances,
  [FetchNode.TokenAddresses, FetchNode.ChainID, FetchNode.UserAddress],
)
