import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { getLocalStorage } from '../../utils'
import { LendBorrowOptions } from '../../components/Lend'

export interface LendSelectionState {
  optionSelected: LendBorrowOptions,
}
const name = 'lendSelection'

export const lendSelectionSlice = createSlice({
  name,
  initialState: getLocalStorage(name, {optionSelected: LendBorrowOptions.Lend}) as LendSelectionState,
  reducers: {
    selectionMade: (state, action: PayloadAction<LendBorrowOptions>) => {
      state.optionSelected = action.payload
    },
  }
})

export const { selectionMade } = lendSelectionSlice.actions

export default lendSelectionSlice.reducer
