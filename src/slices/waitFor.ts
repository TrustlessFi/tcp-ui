import { AppDispatch, store, RootState } from './../app/store'
import { AsyncThunkAction, SerializedError } from '@reduxjs/toolkit'
import { AppSelector } from './../app/hooks'
import { getGovernorInfo, governorInfo, governorArgs } from './governor'
import { getMarketInfo, marketArgs, marketInfo } from './market'
import { getRatesInfo, ratesInfo, ratesArgs } from './rates'
import { getReferenceTokens, referenceTokens, referenceTokenArgs } from './referenceTokens'
import { getReferenceTokenBalances, referenceTokenBalances, referenceTokenBalancesArgs } from './balances/referenceTokenBalances'
import { balanceData, balanceState, fetchTokenBalanceArgs } from './balances'
import { getPositions, positionsInfo, positionsArgs } from './positions'
import { getSystemDebtInfo, systemDebtInfo, systemDebtArgs } from './systemDebt'
import { getLiquidationsInfo, liquidationsArgs, liquidationsInfo } from './liquidations'
import { sliceState } from './'
import { Nullable } from '../utils'

import { getPricesInfo, pricesInfo, pricesArgs } from './prices/index'

export const waitForPrices = (
  selector: AppSelector,
  dispatch: AppDispatch
) => manageSelection<pricesArgs, pricesInfo>(
  {
    chainID: selector(state => state.chainID.chainID),
    governorInfo: waitForGovernor(selector, dispatch),
    liquidationsInfo: waitForLiquidations(selector, dispatch),
  },
  (state: RootState) => state.prices,
  (args: pricesArgs) => dispatch(getPricesInfo(args)),
  selector,
)

export const waitForGovernor = (
  selector: AppSelector,
  dispatch: AppDispatch
) => manageSelection<governorArgs, governorInfo>(
  { chainID: selector(state => state.chainID.chainID) },
  (state: RootState) => state.governor,
  (args: marketArgs) => dispatch(getGovernorInfo(args)),
  selector,
)

/* // THE DREAM
export const waitForGovernor = getManageSelectionFunction<governorArgs, governorInfo>(
  (state: RootState) => state.governor, // the state we care about
  getGovernorInfo, // the function to get the data
  [State.ChainID], // the args for the function
)
*/

export const waitForMarket = (
  selector: AppSelector,
  dispatch: AppDispatch
) => manageSelection<marketArgs, marketInfo>(
  { chainID: selector(state => state.chainID.chainID) },
  (state: RootState) => state.market,
  (data: marketArgs) => dispatch(getMarketInfo(data)),
  selector,
)

export const waitForLiquidations = (
  selector: AppSelector,
  dispatch: AppDispatch
) => manageSelection<liquidationsArgs, liquidationsInfo>(
  { chainID: selector(state => state.chainID.chainID) },
  (state: RootState) => state.liquidations,
  (data: marketArgs) => dispatch(getMarketInfo(data)),
  selector,
)


export const waitForRates = (
  selector: AppSelector,
  dispatch: AppDispatch
) => manageSelection<ratesArgs, ratesInfo>(
  { chainID: selector(state => state.chainID.chainID) },
  (state: RootState) => state.rates,
  (data: marketArgs) => dispatch(getRatesInfo(data)),
  selector,
)

export const waitForSDI = (
  selector: AppSelector,
  dispatch: AppDispatch
) => manageSelection<systemDebtArgs, systemDebtInfo>(
  { chainID: selector(state => state.chainID.chainID) },
  (state: RootState) => state.systemDebt,
  (data: systemDebtArgs) => dispatch(getSystemDebtInfo(data)),
  selector,
)

export const waitForReferenceTokens = (
  selector: AppSelector,
  dispatch: AppDispatch
) => manageSelection<referenceTokenArgs, referenceTokens>(
  {
    chainID: selector(state => state.chainID.chainID) ,
    governorInfo: waitForGovernor(selector, dispatch),
  },
  (state: RootState) => state.referenceTokens,
  (data: referenceTokenArgs) => dispatch(getReferenceTokens(data)),
  selector,
)


export const waitForReferenceTokenBalances = (selector: AppSelector, dispatch: AppDispatch): referenceTokenBalances | null => {
  const chainID = selector(state => state.chainID.chainID)
  const userAddress = selector(state => state.wallet.address)
  const referenceTokens = waitForReferenceTokens(selector, dispatch)

  const referenceTokenBalances = selector(state => state.referenceTokenBalances.data.value)
  const referenceTokenError = selector(state => state.referenceTokenBalances.data.error)

  if (referenceTokenError !== null) {
    console.error(referenceTokenError)
    throw referenceTokenError.message
  }

  if (chainID === null || userAddress === null || referenceTokens === null) return null

  let isEmpty = referenceTokenBalances == null || Object.values(referenceTokenBalances!).length === 0

  if (isEmpty && !store.getState().referenceTokenBalances.loading) {
    dispatch(getReferenceTokenBalances({tokenAddresses: referenceTokens, args: {chainID, userAddress}}))
  }
  return referenceTokenBalances
}

export const waitForProtocolTokenBalance = (
  selector: AppSelector,
  dispatch: AppDispatch,
  stateSelector: (state: RootState) => balanceState,
  balanceThunk: (args: fetchTokenBalanceArgs) => AsyncThunkAction<balanceData | null, fetchTokenBalanceArgs, {}>,
): balanceData | null => {
  const chainID = selector(state => state.chainID.chainID)
  const userAddress = selector(state => state.wallet.address)

  const balance = selector(state => stateSelector(state).data.value)
  if (chainID === null || userAddress === null) return null

  if (balance === null && !stateSelector(store.getState()).loading) {
    dispatch(balanceThunk({ chainID, userAddress }))
  }
  return balance
}

export const waitForPositions = (
  selector: AppSelector,
  dispatch: AppDispatch
) => manageSelection<positionsArgs, positionsInfo>(
  {
    chainID: selector(state => state.chainID.chainID) ,
    userAddress: selector(state => state.wallet.address),
    sdi: waitForSDI(selector, dispatch),
    marketInfo: waitForMarket(selector, dispatch),
  },
  (state: RootState) => state.positions,
  (data: positionsArgs) => dispatch(getPositions(data)),
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
