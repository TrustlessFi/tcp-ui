import { PayloadAction } from '@reduxjs/toolkit'
import { ChainID } from '@trustlessfi/addresses'
import { createLocalSlice, CacheDuration } from '../'
import { RootState } from '../fetchNodes'

export type chainIDState = ChainID | null

const chainIDSlice = createLocalSlice({
  name: 'chainID',
  initialState: null as chainIDState,
  stateSelector: (state: RootState) => state.chainID,
  cacheDuration: CacheDuration.NONE,
  reducers: {
    chainIDFound: (_state, action: PayloadAction<number>) => {
      const chainID = action.payload
      return ChainID[chainID] === undefined ? null : chainID as ChainID
    },
  }
})

export const { chainIDFound } = chainIDSlice.slice.actions

export default chainIDSlice
