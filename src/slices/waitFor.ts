import { AsyncThunk } from '@reduxjs/toolkit'
import { AppDispatch, store } from '../app/store'
import { RootState, sliceStateValues, FetchNode } from './fetchNodes'
import { AppSelector } from '../app/hooks'
import chainIDSlice from './chainID'
import governorSlice from './governor'
import marketSlice from './market'
import ratesInfoSlice from './rates'
import poolsMetadataSlice from './poolsMetadata'
import poolsCurrentDataSlice from './poolsCurrentData'
import liquidityPositionsSlice from './liquidityPositions'
import positionsSlice from './positions'
import systemDebtSlice from './systemDebt'
import liquidationsSlice from './liquidations'
import rewardsInfoSlice from './rewards'
import pricesSlice from './prices'
import balancesSlice from './balances'
import contractsSlice from './contracts'
import rootContractsSlice from './rootContracts'
import currentChainInfoSlice from './currentChainInfo'
import userAddressSlice from './userAddress'
import uniswapContractsSlice from './uniswapContracts'
import notificationsSlice from './notifications'
import transactionsSlice from './transactions'
import walletSlice from './wallet'

import { sliceState, NonNullValues } from './'

const getWaitFunction = <
    Value,
    SliceState extends sliceState<Value>,
    Dependencies extends Partial<{[node in FetchNode]: sliceStateValues[node]}>,
  >(waitForData: {
    stateSelector: (state: RootState) => SliceState
    dependencies: Dependencies
    thunk: AsyncThunk<Value, NonNullValues<Dependencies>, {}>
  }) => (selector: AppSelector, dispatch: AppDispatch) => {

    const { stateSelector, thunk, dependencies} = waitForData
    const state = selector(stateSelector)

    const inputArgs = Object.fromEntries(Object.keys(dependencies).map(fetchNode =>
      [fetchNode, (() => waitForImpl)()[fetchNode as FetchNode](selector, dispatch)]
    )) as Dependencies

    if (Object.values(inputArgs).includes(null)) return null

    if (state.error !== null) {
      console.error(state.error.message)
      throw state.error
    }

    if (state.value === null && !stateSelector(store.getState()).loading) {
      dispatch(thunk(inputArgs as NonNullValues<Dependencies>))
    }

    return state.value
  }

const getLocalDataSelector = <Value>(slice: {stateSelector: (state: RootState) => Value}) =>
  (selector: AppSelector, _dispatch: AppDispatch) => selector(slice.stateSelector)

const waitForImpl: {[key in FetchNode]: (selector: AppSelector, _dispatch: AppDispatch) => sliceStateValues[key] | null} = {
  chainID: getLocalDataSelector(chainIDSlice),
  rootContracts: getLocalDataSelector(rootContractsSlice),
  userAddress: getLocalDataSelector(userAddressSlice),
  notifications: getLocalDataSelector(notificationsSlice),
  transactions: getLocalDataSelector(transactionsSlice),
  wallet: getLocalDataSelector(walletSlice),

  balances: getWaitFunction(balancesSlice),
  contracts: getWaitFunction(contractsSlice),
  currentChainInfo: getWaitFunction(currentChainInfoSlice),
  governorInfo: getWaitFunction(governorSlice),
  liquidationsInfo: getWaitFunction(liquidationsSlice),
  liquidityPositions: getWaitFunction(liquidityPositionsSlice),
  marketInfo: getWaitFunction(marketSlice),
  poolsCurrentData: getWaitFunction(poolsCurrentDataSlice),
  poolsMetadata: getWaitFunction(poolsMetadataSlice),
  positions: getWaitFunction(positionsSlice),
  pricesInfo: getWaitFunction(pricesSlice),
  ratesInfo: getWaitFunction(ratesInfoSlice),
  rewardsInfo: getWaitFunction(rewardsInfoSlice),
  sdi: getWaitFunction(systemDebtSlice),
  uniswapContracts: getWaitFunction(uniswapContractsSlice),
}

const waitFor = <RequestedNodes extends FetchNode>(
  requestedNodes: RequestedNodes[],
  selector: AppSelector,
  dispatch: AppDispatch
) => Object.fromEntries(
  requestedNodes.map(fetchNode => [fetchNode, waitForImpl[fetchNode](selector, dispatch)])
) as { [requestedNode in RequestedNodes]: sliceStateValues[requestedNode]}

export default waitFor
