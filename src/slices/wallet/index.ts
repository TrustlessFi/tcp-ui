import { createLocalSlice } from '../'
import { RootState } from '../../app/store'

export interface wallet {
  connecting: boolean,
  waitingForMetamask: boolean
}

const partialWalletSlice = createLocalSlice({
  name: 'wallet',
  initialState: { connecting: false, waitingForMetamask: false} as wallet,
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
  },
})

export const walletSlice = {
  ...partialWalletSlice,
  stateSelector: (state: RootState) => state.wallet
}

export const {
  walletConnecting,
  walletConnected,
  walletConnectionFailed,
  waitingForMetamask,
  metamaskComplete,
} = partialWalletSlice.slice.actions

export default partialWalletSlice.slice.reducer
