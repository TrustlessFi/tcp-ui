import { useAppSelector as selector, } from '../../../app/hooks'
import { Slice } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store'
import { transactionsSlice, TransactionState } from '../../../slices/transactions'
import { PositionsEditorState, positionsEditorSlice } from '../../../slices/positionsEditor'
import { minutes } from '../../../utils/'

const localStorage = window.localStorage

type persistedSlice = {
  slice: Slice,
  duration: number,
  getState: (state: RootState) => TransactionState | PositionsEditorState
}

type persistedSlices = {
  [key in keyof RootState]?: persistedSlice
}

export const slicesToPersist: persistedSlices = {
  [transactionsSlice.name]: {
    slice: transactionsSlice,
    duration: 0, // TODO add this in
    getState: (state: RootState) => state.transactions
  },
  [positionsEditorSlice.name]: {
    slice: positionsEditorSlice,
    duration: minutes(1), // TODO add this in
    getState: (state: RootState) => state.positionsEditor
  }
}


export default () => {
  for (const [k, v] of Object.entries(slicesToPersist)) {
    const state = selector(v!.getState)
    localStorage.setItem(k, JSON.stringify(state))
  }
  return <></>
}
