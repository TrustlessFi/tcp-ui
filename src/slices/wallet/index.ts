import { createLocalSlice, CacheDuration } from '../'
import { RootState } from '../fetchNodes'
import { PayloadAction } from '@reduxjs/toolkit'

export interface walletState {
  connecting: boolean
  waitingForMetamask: boolean
  initialized: boolean
  switchNetworkButtonClicked: boolean
}

const walletSlice = createLocalSlice({
  name: 'wallet',
  initialState: {
    connecting: false,
    waitingForMetamask: false,
    initialized: false,
    switchNetworkButtonClicked: false,
  } as walletState,
  stateSelector: (state: RootState) => state.wallet,
  cacheDuration: CacheDuration.NONE,
  reducers: {
    walletConnecting: (state) => {
      state.connecting = true
    },
    walletConnected: (state) => {
      state.connecting = false
    },
    walletConnectionFailed: (state) => {
      state.connecting = false
    },
    waitingForMetamask: (state) => {
      state.waitingForMetamask = true
    },
    metamaskComplete: (state) => {
      state.waitingForMetamask = false
    },
    appInitialized: (state) => {
      state.initialized = true
    },
    setSwitchNetworkButtonClicked: (state, action: PayloadAction<boolean>) => {
      state.switchNetworkButtonClicked = action.payload
    },
  },
})

export const {
  walletConnecting,
  walletConnected,
  walletConnectionFailed,
  waitingForMetamask,
  metamaskComplete,
  appInitialized,
  setSwitchNetworkButtonClicked,
} = walletSlice.slice.actions

export default walletSlice
