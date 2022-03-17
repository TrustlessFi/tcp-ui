import { PayloadAction } from '@reduxjs/toolkit'
import { createLocalSlice, CacheDuration } from '../'
import { RootState } from '../fetchNodes'

export interface onboardingState {
  approvingEth: boolean
  approvingHue: boolean
  approvingLendHue: boolean
  approvePool: {[key in number]: boolean}
}

const initialState = {
  approvingEth: false,
  approvingHue: false,
  approvingLendHue: false,
  approvePool: {},
} as onboardingState

const onboardingSlice = createLocalSlice({
  name: 'onboarding',
  initialState,
  stateSelector: (state: RootState) => state.onboarding,
  cacheDuration: CacheDuration.NONE,
  isUserData: true,
  reducers: {
    setApprovingEth: (state, action: PayloadAction<boolean>) => {
      state.approvingEth = action.payload
    },
    setApprovingHue: (state, action: PayloadAction<boolean>) => {
      state.approvingHue = action.payload
    },
    setApprovingLendHue: (state, action: PayloadAction<boolean>) => {
      state.approvingLendHue = action.payload
    },
    setApprovingPool: (state, action: PayloadAction<{poolID: number, approving: boolean}>) => {
      state.approvePool[action.payload.poolID] = action.payload.approving
    },
  },
})

export const {
  setApprovingEth,
  setApprovingHue,
  setApprovingLendHue,
  setApprovingPool
} = onboardingSlice.slice.actions

export default onboardingSlice
