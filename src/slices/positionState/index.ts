import { createLocalSlice, CacheDuration } from '../'
import { RootState } from '../fetchNodes'
import { PayloadAction } from '@reduxjs/toolkit'
import { Position } from '../positions'

export interface positionState {
  collateralCount: number
  debtCount: number
  isUpdating: boolean
  position: Position | null
}

const initialState = {
  collateralCount: 0,
  debtCount: 0,
  isUpdating: false,
  position: null,
} as positionState

const positionStateSlice = createLocalSlice({
  name: 'positionState',
  initialState,
  stateSelector: (state: RootState) => state.positionState,
  cacheDuration: CacheDuration.SHORT,
  isUserData: true,
  reducers: {
    setPosition: (state, action: PayloadAction<Position | null>) => {
      state.position = action.payload
    },
    setCollateralCount: (state, action: PayloadAction<number>) => {
      state.collateralCount = action.payload
    },
    setDebtCount: (state, action: PayloadAction<number>) => {
      state.debtCount = action.payload
    },
    setIsUpdating: (state, action: PayloadAction<boolean>) => {
      state.isUpdating = action.payload
    },
    clearPositionState: (_state) => initialState
  },
})

export const {
  setPosition,
  setIsUpdating,
  setDebtCount,
  setCollateralCount,
  clearPositionState
} = positionStateSlice.slice.actions

export default positionStateSlice
