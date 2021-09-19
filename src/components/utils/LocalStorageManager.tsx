import { useAppSelector as selector, } from '../../app/hooks'
import { Slice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store'
import { transactionsSlice, TransactionState } from '../../slices/transactions'
import { positionsEditorSlice, PositionsEditorState } from '../../slices/positionsEditor'
import { contractsSlice, ProtocolContractsState } from '../../slices/contracts'
import { minutes, timeS } from '../../utils/'

type slicesState = TransactionState | PositionsEditorState | ProtocolContractsState

type persistedSlice = {
  slice: Slice,
  ttl: number,
  getState: (state: RootState) => slicesState
}

type persistedSlices = {
  [key in keyof RootState]?: persistedSlice
}

const NO_EXPIRATION = -1

export const slicesToPersist: persistedSlices = {
  [transactionsSlice.name]: {
    slice: transactionsSlice,
    ttl: NO_EXPIRATION,
    getState: (state: RootState) => state.transactions
  },
  [positionsEditorSlice.name]: {
    slice: positionsEditorSlice,
    ttl: minutes(10),
    getState: (state: RootState) => state.positionsEditor
  },
  [contractsSlice.name]: {
    slice: contractsSlice,
    ttl: minutes(10),
    getState: (state: RootState) => state.contracts
  }
}

type sliceStateWithExpiration = { expiration: number, sliceState: slicesState }

export default () => {
  for (const [key, slice] of Object.entries(slicesToPersist)) {
    const sliceState = selector(slice!.getState)
    const ttl = slice!.ttl
    const year2120 = 4733539200
    const expiration = ttl === NO_EXPIRATION ? year2120 : timeS() + slice!.ttl
    const stateWithTimestamp: sliceStateWithExpiration = { expiration, sliceState }
    localStorage.setItem(key, JSON.stringify(stateWithTimestamp))
  }
  return <></>
}
