import { createLocalSlice, CacheDuration } from '../'
import { RootState } from '../fetchNodes'
import { PayloadAction } from '@reduxjs/toolkit'
import { Tab } from '../../App'

export interface tabsState {
  currentTab: Tab | null
}

const tabsSlice = createLocalSlice({
  name: 'tabs',
  initialState: {
    currentTab: null,
  } as tabsState,
  stateSelector: (state: RootState) => state.tabs,
  cacheDuration: CacheDuration.NONE,
  reducers: {
    setTab: (state, action: PayloadAction<Tab>) => {
      state.currentTab = action.payload
    },
  },
})

export const {
  setTab,
} = tabsSlice.slice.actions

export default tabsSlice
