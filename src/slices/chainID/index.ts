import { PayloadAction } from '@reduxjs/toolkit'
import { ChainID, getAddress } from '@trustlessfi/addresses'
import { createLocalSlice } from '../'
import { RootState } from '../../app/store'

const initialState = null as ChainID | null

const partialChainIDSlice = createLocalSlice({
  name: 'chainID',
  initialState,
  reducers: {
    chainIDFound: (_state, action: PayloadAction<number>) => {
      const chainID = action.payload
      if (ChainID[chainID] !== undefined) return chainID as ChainID
    },
  }
})

export const chainIDSlice = {
  ...partialChainIDSlice,
  stateSelector: (state: RootState) => state.chainID
}

export const { chainIDFound } = partialChainIDSlice.slice.actions

export default partialChainIDSlice.slice.reducer
