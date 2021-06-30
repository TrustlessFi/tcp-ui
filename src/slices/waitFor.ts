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
  (data: marketArgs) => dispatch(getLiquidationsInfo(data)),
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
