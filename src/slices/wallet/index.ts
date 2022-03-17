import { createLocalSlice, CacheDuration } from '../'
import { RootState } from '../fetchNodes'
import { PayloadAction } from '@reduxjs/toolkit'
import { TransactionType } from '../transactions'

export interface walletState {
  connecting: boolean
  waitingForMetamask: TransactionType | null
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
    waitingForMetamask: (state, action: PayloadAction<TransactionType>) => {
      state.waitingForMetamask = action.payload
    },
    metamaskComplete: (state) => {
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
  waitingForMetamask,
  metamaskComplete,
  appInitialized,
  setSwitchNetworkButtonClicked,
} = walletSlice.slice.actions

export default walletSlice
