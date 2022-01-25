import { AsyncThunk } from '@reduxjs/toolkit'
import { AppDispatch, store } from '../app/store'
import { RootState, sliceStateValues, FetchNode } from './fetchNodes'
import { AppSelector } from '../app/hooks'

import { sliceState, NonNullValues, SliceDataType } from './'
import allSlices from './allSlices'

const getWaitFunction = <
    Value,
    Dependencies extends Partial<{[node in FetchNode]: sliceStateValues[node]}>,
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

const getLocalDataSelector = <Value>(slice: {stateSelector: (state: RootState) => Value}) =>
  (selector: AppSelector, _dispatch: AppDispatch) => selector(slice.stateSelector)

  // TODO avoid using any
const waitForImpl = Object.fromEntries(
  Object.entries(allSlices)
    .map(([sliceName, slice]) => [
      sliceName,
      slice.sliceType === SliceDataType.ChainData
      ? getWaitFunction(slice as any)
      : getLocalDataSelector(slice as any)
    ])) as {[key in FetchNode]: (selector: AppSelector, _dispatch: AppDispatch) => sliceStateValues[key]}

const waitFor = <RequestedNodes extends FetchNode>(
  requestedNodes: RequestedNodes[],
  selector: AppSelector,
  dispatch: AppDispatch
) => Object.fromEntries(
  requestedNodes.map(fetchNode => [fetchNode, waitForImpl[fetchNode](selector, dispatch)])
) as { [requestedNode in RequestedNodes]: sliceStateValues[requestedNode]}

export default waitFor
