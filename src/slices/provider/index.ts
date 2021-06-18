import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ethers } from 'ethers'

export enum ChainID {
  // Mainnet = 1,
  Rinkeby = 4,
  Hardhat = 1337,
}

export interface ProviderState {
  provider: ethers.providers.Web3Provider | null
  chainID: ChainID | null
  unknownChainID: number
}

const initialState: ProviderState = {
  provider: null,
  chainID: null,
  unknownChainID: 0,
}

export const providerSlice = createSlice({
  name: 'provider',
  initialState,
  reducers: {
    providerFound: (state, action: PayloadAction<{ chainID: number, provider: ethers.providers.Web3Provider }>) => {
      if (ChainID[action.payload.chainID] === undefined) state.unknownChainID = action.payload.chainID
      else state.chainID = action.payload.chainID as ChainID
      state.provider = action.payload.provider
    },
  },
  extraReducers: () => {},
})

export const { providerFound } = providerSlice.actions;

export default providerSlice.reducer;
