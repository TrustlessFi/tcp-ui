import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ethers } from 'ethers';

export interface ProviderData {
  provider: ethers.providers.Web3Provider
}

export interface WalletState {
  address: string | null,
  connecting: boolean,
}

const initialState: WalletState = { address: null, connecting: false }

export const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    connecting: (state) => {
      console.log("connecting")
      state.connecting = true
    },
    connected: (state, action: PayloadAction<string>) => {
      console.log("connected")
      state.connecting = false
      state.address = action.payload
    },
    connectionFailed: (state) => {
      console.log("connectionFailed")
      state.connecting = false
    },

  },
  extraReducers: () => {},
});

export const { connecting, connected, connectionFailed } = walletSlice.actions;

export default walletSlice.reducer;
