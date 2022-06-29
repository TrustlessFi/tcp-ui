import { createLocalSlice, CacheDuration } from '../'
import { RootState } from '../fetchNodes'
import { PayloadAction } from '@reduxjs/toolkit'

export interface errorsState {
  renderErrors: {}[],
  walletErrors: {}[],
}

const initialState: errorsState = {
  renderErrors: [],
  walletErrors: [],
} as errorsState

const walletSlice = createLocalSlice({
  name: 'errors',
  initialState,
  stateSelector: (state: RootState) => state.errors,
  cacheDuration: CacheDuration.INFINITE,
  reducers: {
    addRenderError: (state, action: PayloadAction<{}>) => {
      state.renderErrors.push(action.payload)
    },
    addWalletError: (state, action: PayloadAction<{}>) => {
      state.walletErrors.push(action.payload)
    },
  },
})

export const {
  addRenderError,
  addWalletError,
} = walletSlice.slice.actions

export default walletSlice
