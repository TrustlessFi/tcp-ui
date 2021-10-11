import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ChainID } from '@trustlessfi/addresses'

export interface ChainIDState {
  chainID: ChainID | null
  unknownChainID: number | null
}

const initialState: ChainIDState = {
  chainID: null,
  unknownChainID: null,
}

const name = 'chainID'

export const chainIDSlice = createSlice({
  name,
  initialState: initialState,
  reducers: {
    chainIDFound: (state, action: PayloadAction<number>) => {
      const chainID = action.payload
      if (ChainID[chainID] === undefined) {
        state.unknownChainID = chainID
        state.chainID = null
      } else {
        state.unknownChainID = null
        state.chainID = chainID
      }
    },
  }
})

export const { chainIDFound } = chainIDSlice.actions

export default chainIDSlice.reducer
