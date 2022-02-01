import { createLocalSlice, CacheDuration } from '../'
import { RootState } from '../fetchNodes'
import { PayloadAction } from '@reduxjs/toolkit'

export interface stakeState {
  increaseAmount: number
  decreaseAmount: number
}

const initialState = {increaseAmount: 0, decreaseAmount: 0} as stakeState

const stakeStateSlice = createLocalSlice({
  name: 'stakeState',
  initialState,
  stateSelector: (state: RootState) => state.stakeState,
  cacheDuration: CacheDuration.SHORT,
  reducers: {
    setIncreaseAmount: (state, action: PayloadAction<number>) => {
      state.increaseAmount = action.payload
    },
    setDecreaseAmount: (state, action: PayloadAction<number>) => {
      state.decreaseAmount = action.payload
    },
    clearStakeState: (_state) => initialState
  },
})

export const { setIncreaseAmount, setDecreaseAmount, clearStakeState } = stakeStateSlice.slice.actions

export default stakeStateSlice
