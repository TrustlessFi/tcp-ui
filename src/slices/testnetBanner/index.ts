import { createLocalSlice, CacheDuration } from '../'
import { RootState } from '../fetchNodes'
import { PayloadAction } from '@reduxjs/toolkit'

export interface testnetBannerState {
  discordBannerClosed: boolean
  tutorialBannerClosed: boolean
}

const initialState = {
  discordBannerClosed: false,
  tutorialBannerClosed: false,
} as testnetBannerState

const testnetBannerSlice = createLocalSlice({
  name: 'testnetBanner',
  initialState,
  stateSelector: (state: RootState) => state.testnetBanner,
  cacheDuration: CacheDuration.INFINITE,
  isUserData: false,
  reducers: {
    setDiscordBannerClosed: (state, action: PayloadAction<boolean>) => {
      state.discordBannerClosed = action.payload
    },
    setTutorialBannerClosed: (state, action: PayloadAction<boolean>) => {
      state.tutorialBannerClosed = action.payload
    },
  },
})

export const {
  setDiscordBannerClosed,
  setTutorialBannerClosed,
} = testnetBannerSlice.slice.actions

export default testnetBannerSlice
