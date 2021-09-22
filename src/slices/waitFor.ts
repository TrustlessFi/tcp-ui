import { AppDispatch, store, RootState } from './../app/store'
import { AsyncThunkAction } from '@reduxjs/toolkit'
import { AppSelector } from './../app/hooks'
import { getGovernorInfo, governorInfo, governorArgs } from './governor'
import { getMarketInfo, marketArgs, marketInfo } from './market'
import { getRatesInfo, ratesInfo, ratesArgs } from './rates'
import { getReferenceTokens, referenceTokens, referenceTokenArgs } from './referenceTokens'
import { getReferenceTokenBalances, referenceTokenBalances, referenceTokenBalancesArgs } from './balances/referenceTokenBalances'
import { balanceInfo, balanceArgs } from './balances'
import { getHueBalance } from './balances/hueBalance'
import { getPools, poolsArgs, poolsInfo } from './pools'
import { getLendHueBalance } from './balances/lendHueBalance'
import { getLiquidityPositions, liquidityPositionsArgs, liquidityPositions, loading as loadingLiquidityPositions } from './liquidityPositions'
import { getPositions, positionsInfo, positionsArgs } from './positions'
import { getProposals, proposalsInfo, proposalsArgs } from './proposals'
import { getSystemDebtInfo, systemDebtInfo, systemDebtArgs } from './systemDebt'
import { getLiquidationsInfo, liquidationsArgs, liquidationsInfo } from './liquidations'
import { sliceState } from './'

import { getPricesInfo, pricesInfo, pricesArgs } from './prices/index'

enum FetchNode {
  ChainID,
  TokenAddresses,
  UserAddress,
  MarketInfo,
  GovernorInfo,
  RatesInfo,
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
    case FetchNode.RatesInfo:
      return {ratesInfo: waitForRates(selector, dispatch)}
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
    inputArgs = {...inputArgs, ...fetchedNode}
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
  [FetchNode.ChainID, FetchNode.LiquidationsInfo],
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

export const waitForProposals = getWaitFunction<proposalsArgs, proposalsInfo>(
  (state: RootState) => state.proposals,
  getProposals,
  [FetchNode.ChainID],
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
  [FetchNode.ChainID, FetchNode.RatesInfo],
)

export const waitForHueBalance = getWaitFunction<balanceArgs, balanceInfo>(
  (state: RootState) => state.hueBalance,
  getHueBalance,
  [FetchNode.ChainID, FetchNode.UserAddress],
)

export const waitForLendHueBalance = getWaitFunction<balanceArgs, balanceInfo>(
  (state: RootState) => state.hueBalance,
  getLendHueBalance,
  [FetchNode.ChainID, FetchNode.UserAddress],
)

export const waitForReferenceTokenBalances = getWaitFunction<referenceTokenBalancesArgs, referenceTokenBalances>(
  (state: RootState) => state.referenceTokenBalances,
  getReferenceTokenBalances,
  [FetchNode.TokenAddresses, FetchNode.ChainID, FetchNode.UserAddress],
)

export const waitForLiquidityPositions = (selector: AppSelector, dispatch: AppDispatch) => {
  dispatch(loadingLiquidityPositions())

  return getWaitFunction<liquidityPositionsArgs, liquidityPositions>(
    (state: RootState) => state.liquidityPositions,
    getLiquidityPositions,
    [FetchNode.ChainID, FetchNode.UserAddress],
  )(selector, dispatch)
}

export const waitForPools = getWaitFunction<poolsArgs, poolsInfo>(
  (state: RootState) => state.pools,
  getPools,
  [FetchNode.ChainID, FetchNode.UserAddress],
)