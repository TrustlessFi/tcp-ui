import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { getLocalStorage } from '../../utils'
import { LendBorrowOption } from '../../components/Lend'

export interface LendSelectionState {
  optionSelected: LendBorrowOption,
}
const name = 'lendSelection'

export const lendSelectionSlice = createSlice({
  name,
  initialState: getLocalStorage(name, {optionSelected: LendBorrowOption.Lend}) as LendSelectionState,
  reducers: {
    selectionMade: (state, action: PayloadAction<LendBorrowOption>) => {
      state.optionSelected = action.payload
    },
  }
})

export const { selectionMade } = lendSelectionSlice.actions

export default lendSelectionSlice.reducer
