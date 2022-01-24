import { PayloadAction } from '@reduxjs/toolkit'
import { ChainID } from '@trustlessfi/addresses'
import { createLocalSlice } from '../'
import { RootState } from '../fetchNodes'

const chainIDSlice = createLocalSlice({
  name: 'chainID',
  initialState: null as ChainID | null,
  stateSelector: (state: RootState) => state.chainID,
  reducers: {
    chainIDFound: (_state, action: PayloadAction<number>) => {
      const chainID = action.payload
      if (ChainID[chainID] !== undefined) return chainID as ChainID
    },
  }
})

export const { chainIDFound } = chainIDSlice.slice.actions

export default chainIDSlice
