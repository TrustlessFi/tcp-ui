import { createLocalSlice, CacheDuration } from '../'
import { RootState } from '../fetchNodes'

export interface wallet {
  connecting: boolean,
  waitingForMetamask: boolean
}

const walletSlice = createLocalSlice({
  name: 'wallet',
  initialState: { connecting: false, waitingForMetamask: false} as wallet,
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
  },
})

export const {
  walletConnecting,
  walletConnected,
  walletConnectionFailed,
  waitingForMetamask,
  metamaskComplete,
} = walletSlice.slice.actions

export default walletSlice
