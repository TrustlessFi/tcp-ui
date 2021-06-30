import { AppDispatch, store, RootState } from './../app/store'
import { AsyncThunkAction } from '@reduxjs/toolkit'
import { AppSelector } from './../app/hooks'
import { getGovernorInfo, governorInfo, governorArgs } from './governor'
import { getMarketInfo, marketArgs, marketInfo } from './market'
import { getRatesInfo, ratesInfo, ratesArgs } from './rates'
import { getReferenceTokens, referenceTokens, referenceTokenArgs } from './referenceTokens'
import { getReferenceTokenBalances, referenceTokenBalances, referenceTokenBalancesArgs } from './balances/referenceTokenBalances'
import { balanceInfo, balanceState, fetchTokenBalanceArgs } from './balances'
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

const getManageSelectionFunction = <Args extends {}, Value>(
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

export const waitForGovernor = getManageSelectionFunction<governorArgs, governorInfo>(
  (state: RootState) => state.governor,
  getGovernorInfo,
  [FetchNode.ChainID],
)

export const waitForPrices = getManageSelectionFunction<pricesArgs, pricesInfo>(
  (state: RootState) => state.prices,
  getPricesInfo,
  [FetchNode.ChainID, FetchNode.GovernorInfo, FetchNode.LiquidationsInfo],
)

export const waitForMarket = getManageSelectionFunction<marketArgs, marketInfo>(
  (state: RootState) => state.market,
  getMarketInfo,
  [FetchNode.ChainID],
)

export const waitForPositions = getManageSelectionFunction<positionsArgs, positionsInfo>(
  (state: RootState) => state.positions,
  getPositions,
  [FetchNode.ChainID, FetchNode.UserAddress, FetchNode.SDI, FetchNode.MarketInfo],
)

export const waitForLiquidations = getManageSelectionFunction<liquidationsArgs, liquidationsInfo>(
  (state: RootState) => state.liquidations,
  getLiquidationsInfo,
  [FetchNode.ChainID],
)

export const waitForRates = getManageSelectionFunction<ratesArgs, ratesInfo>(
  (state: RootState) => state.rates,
  getRatesInfo,
  [FetchNode.ChainID],
)

export const waitForSDI = getManageSelectionFunction<systemDebtArgs, systemDebtInfo>(
  (state: RootState) => state.systemDebt,
  getSystemDebtInfo,
  [FetchNode.ChainID],
)

export const waitForReferenceTokens = getManageSelectionFunction<referenceTokenArgs, referenceTokens>(
  (state: RootState) => state.referenceTokens,
  getReferenceTokens,
  [FetchNode.ChainID, FetchNode.GovernorInfo],
)

// TODO make one for each protocol token and dont have the extra variables here
export const waitForProtocolTokenBalance = (
  selector: AppSelector,
  dispatch: AppDispatch,
  stateSelector: (state: RootState) => balanceState,
  balanceThunk: (args: fetchTokenBalanceArgs) => AsyncThunkAction<balanceInfo | null, fetchTokenBalanceArgs, {}>,
) => manageSelection<fetchTokenBalanceArgs, balanceInfo>(
  {
    chainID: selector(state => state.chainID.chainID),
    userAddress: selector(state => state.wallet.address),
  },
  stateSelector,
  (data: fetchTokenBalanceArgs) => dispatch(balanceThunk(data)),
  selector,
)

// TODO convert this
export const waitForReferenceTokenBalances = (
  selector: AppSelector,
  dispatch: AppDispatch,
) => manageSelection<referenceTokenBalancesArgs, referenceTokenBalances>(
  {
    tokenAddresses: waitForReferenceTokens(selector, dispatch),
    chainID: selector(state => state.chainID.chainID),
    userAddress: selector(state => state.wallet.address),
  },
  (state: RootState) => state.referenceTokenBalances,
  (data: referenceTokenBalancesArgs) => dispatch(getReferenceTokenBalances(data)),
  selector,
)


const manageSelection = <Args extends {}, Value>(
  inputArgs: Nullable<Args>,
  stateSelector: (state: RootState) => sliceState<Value>,
  doDispatch: (data: Args) => any,
  selector: AppSelector,
) => {
  const state = selector(stateSelector)
  if (Object.values(inputArgs).includes(null)) return null

  const error = state.data.error
  if (error !== null) {
    console.error(error.message)
    throw error.message
  }
  if (state.data.value === null && !stateSelector(store.getState()).loading) {
    doDispatch(inputArgs as NonNullable<Args>)
  }
  return state.data.value
}
