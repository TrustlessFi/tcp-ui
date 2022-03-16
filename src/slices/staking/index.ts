import { createLocalSlice, CacheDuration } from '../'
import { RootState } from '../fetchNodes'
import { PayloadAction } from '@reduxjs/toolkit'

export enum StakePage {
  View = 'View',
  Add = 'Add',
  Withdraw = 'Withdraw',
}

export interface stakingState {
  increaseAmount: number
  decreaseAmount: number
  stakePage: StakePage
}

const initialState = {
  increaseAmount: 0,
  decreaseAmount: 0,
  stakePage: StakePage.View
} as stakingState

const stakingSlice = createLocalSlice({
  name: 'staking',
  initialState,
  stateSelector: (state: RootState) => state.staking,
  cacheDuration: CacheDuration.NONE,
  isUserData: true,
  reducers: {
    setIncreaseAmount: (state, action: PayloadAction<number>) => {
      state.increaseAmount = action.payload
    },
    setDecreaseAmount: (state, action: PayloadAction<number>) => {
      state.decreaseAmount = action.payload
    },
    setStakePage: (state, action: PayloadAction<StakePage>) => {
      state.stakePage = action.payload
    },
  },
})
export const {
  setIncreaseAmount,
  setDecreaseAmount,
  setStakePage,
  clearData
} = stakingSlice.slice.actions

export default stakingSlice
