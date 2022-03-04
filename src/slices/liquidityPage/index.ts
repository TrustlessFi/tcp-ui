import { createLocalSlice, CacheDuration } from '../'
import { RootState } from '../fetchNodes'
import { PayloadAction } from '@reduxjs/toolkit'

export enum LiquidityPage {
  View = 'View',
  Add = 'Add',
  Remove = 'Remove',
}

export interface liquidityPageState {
  liquidityPageNonce: number
}

const initialState = {
  liquidityPageNonce: 0,
} as liquidityPageState

const liquidityPageSlice = createLocalSlice({
  name: 'liquidityPage',
  initialState,
  stateSelector: (state: RootState) => state.liquidityPage,
  cacheDuration: CacheDuration.NONE,
  isUserData: false,
  reducers: {
    incrementNonce: (state) => {
      state.liquidityPageNonce++
    },
    resetNonce: (state) => {
      state.liquidityPageNonce = 0
    },
  },
})

export const { incrementNonce, resetNonce } = liquidityPageSlice.slice.actions

export default liquidityPageSlice
