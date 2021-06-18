import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export enum ChainID {
  // Mainnet = 1,
  Rinkeby = 4,
  Hardhat = 1337,
}

export interface ChainIDState {
  chainID: null | ChainID
  unknownChainID: number
}

const initialState: ChainIDState = {
  chainID: null,
  unknownChainID: 0,
}

export const chainIDSlice = createSlice({
  name: 'positions',
  initialState,
  reducers: {
    chainIDUpdated: (state, action: PayloadAction<number>) => {
      if (ChainID[action.payload] === undefined) state.unknownChainID = action.payload
      else state.chainID = action.payload as ChainID

      console.log({state: state.chainID})
    },
  },
  extraReducers: () => {},
})

export const { chainIDUpdated } = chainIDSlice.actions;

export default chainIDSlice.reducer;
