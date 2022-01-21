import { createLocalSlice } from '../'
import { RootState } from '../../app/store'

const partialWalletSlice = createLocalSlice({
  name: 'wallet',
  initialState: { connecting: false, waitingForMetamask: false },
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
  stateSelector: (state: RootState) => state.chainID
}

export const {
  walletConnecting,
  walletConnected,
  walletConnectionFailed,
  waitingForMetamask,
  metamaskComplete,
} = partialWalletSlice.slice.actions

export default partialWalletSlice.slice.reducer
