import { createLocalSlice, CacheDuration } from '../'
import { RootState } from '../fetchNodes'
import { PayloadAction } from '@reduxjs/toolkit'

export interface walletState {
  connecting: boolean
  waitingForMetamask: string | null
  initialized: boolean
  switchNetworkButtonClicked: boolean
}

const initialState = {
  connecting: false,
  waitingForMetamask: null,
  initialized: false,
  switchNetworkButtonClicked: false,
} as walletState

const walletSlice = createLocalSlice({
  name: 'wallet',
  initialState,
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
    setWaitingForMetamask: (state, action: PayloadAction<string>) => {
      state.waitingForMetamask = action.payload
    },
    setNotWaitingForMetamask: (state) => {
      state.waitingForMetamask = null
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
  setWaitingForMetamask,
  setNotWaitingForMetamask,
  appInitialized,
  setSwitchNetworkButtonClicked,
} = walletSlice.slice.actions

export default walletSlice
