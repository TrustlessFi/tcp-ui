import { createLocalSlice, CacheDuration } from '../'
import { RootState } from '../fetchNodes'
import { PayloadAction } from '@reduxjs/toolkit'

export enum LiquidityPage {
  View = 'View',
  Add = 'Add',
  Remove = 'Remove',
}

export interface liquidityPageState {
  increaseAmount: number
  decreaseAmount: number
  liquidityPage: LiquidityPage
}

const initialState = {
  increaseAmount: 0,
  decreaseAmount: 0,
  liquidityPage: LiquidityPage.View
} as liquidityPageState

const liquidityPageSlice = createLocalSlice({
  name: 'liquidityPage',
  initialState,
  stateSelector: (state: RootState) => state.liquidityPage,
  cacheDuration: CacheDuration.NONE,
  isUserData: false,
  reducers: {
    setIncreaseAmount: (state, action: PayloadAction<number>) => {
      state.increaseAmount = action.payload
    },
    setDecreaseAmount: (state, action: PayloadAction<number>) => {
      state.decreaseAmount = action.payload
    },
    setLiquidityPage: (state, action: PayloadAction<LiquidityPage>) => {
      state.liquidityPage = action.payload
    },
  },
})

export const {
  setIncreaseAmount,
  setDecreaseAmount,
  setLiquidityPage,
  clearData
} = liquidityPageSlice.slice.actions

export default liquidityPageSlice
