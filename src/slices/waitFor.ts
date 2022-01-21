import { AsyncThunk } from '@reduxjs/toolkit'
import { AppDispatch, store, RootState } from '../app/store'
import { AppSelector } from '../app/hooks'
import { chainIDSlice } from './chainID'
import { governorSlice } from './governor'
import { marketSlice } from './market'
import { ratesInfoSlice } from './rates'
import { poolsMetadataSlice } from './poolsMetadata'
import { poolsCurrentDataSlice } from './poolsCurrentData'
import { liquidityPositionsSlice } from './liquidityPositions'
import { positionsSlice } from './positions'
import { systemDebtSlice } from './systemDebt'
import { liquidationsSlice } from './liquidations'
import { rewardsInfoSlice } from './rewards'
import { pricesSlice } from './prices'
import { balancesSlice } from './balances'
import { contractsSlice } from './contracts'
import { rootContractsSlice } from './rootContracts'
import { currentChainInfoSlice } from './currentChainInfo'
import { userAddressSlice } from './userAddress'

import { sliceState, NonNullValues } from './'
import { FetchNode, FetchNodes } from './fetchNodes'

const getWaitFunction = <
    Value,
    Dependencies extends Partial<{[fetchNode in keyof FetchNodes]: FetchNodes[fetchNode] | null}>,
  >(waitForData: {
    stateSelector: (state: RootState) => sliceState<Value>
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

const getStateSelector = <T>(selectorFunc: (state: RootState) => T) =>
  (selector: AppSelector, _dispatch: AppDispatch) => selector(selectorFunc)

const getLocalDataSelector = <Value>(slice: {stateSelector: (state: RootState) => Value}) =>
  (selector: AppSelector, _dispatch: AppDispatch) => selector(slice.stateSelector)


const allSlices = {
  marketInfo: marketSlice,
  governorInfo: governorSlice,
}


const waitForImpl: {[key in FetchNode]: (selector: AppSelector, _dispatch: AppDispatch) => FetchNodes[key] | null} = {
  chainID: getLocalDataSelector(chainIDSlice),
  rootContracts: getLocalDataSelector(rootContractsSlice),
  userAddress: getLocalDataSelector(userAddressSlice),

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
}

const waitFor = <RequestedNodes extends FetchNode>(
  requestedNodes: RequestedNodes[],
  selector: AppSelector,
  dispatch: AppDispatch
) => Object.fromEntries(
  requestedNodes.map(fetchNode => [fetchNode, waitForImpl[fetchNode](selector, dispatch)])
) as { [requestedNode in RequestedNodes]: FetchNodes[requestedNode]}

export default waitFor
