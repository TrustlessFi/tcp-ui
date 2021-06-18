import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export enum ChainID {
  // Mainnet = 1,
  Rinkeby = 4,
  Hardhat = 1337,
}

export interface ChainIDState {
  chainID: ChainID | null
  unknownChainID: number
}

const initialState: ChainIDState = {
  chainID: null,
  unknownChainID: 0,
}

export const chainIDSlice = createSlice({
  name: 'chainID',
  initialState,
  reducers: {
    chainIDFound: (state, action: PayloadAction<number>) => {
      const chainID = action.payload
      if (ChainID[chainID] === undefined) state.unknownChainID = chainID
      else state.chainID = chainID
    },
  },
  extraReducers: () => {},
})

export const { chainIDFound } = chainIDSlice.actions

export default chainIDSlice.reducer
