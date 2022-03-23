import { createLocalSlice, CacheDuration } from '../'
import { RootState } from '../fetchNodes'
import { PayloadAction } from '@reduxjs/toolkit'

export interface testnetBannerState {
  bannerClosed: boolean
}

const initialState = {
  bannerClosed: false,
} as testnetBannerState

const testnetBannerSlice = createLocalSlice({
  name: 'testnetBanner',
  initialState,
  stateSelector: (state: RootState) => state.testnetBanner,
  cacheDuration: CacheDuration.INFINITE,
  isUserData: false,
  reducers: {
    setBannerClosed: (state, action: PayloadAction<boolean>) => {
      state.bannerClosed = action.payload
    },
  },
})

export const { setBannerClosed } = testnetBannerSlice.slice.actions

export default testnetBannerSlice
