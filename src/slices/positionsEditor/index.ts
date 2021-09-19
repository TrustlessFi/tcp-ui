import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { getLocalStorage } from '../../utils'

interface editorStatus {
  positionID: number,
  creating: boolean,
}

export interface PositionsEditorState {
  open: boolean,
  status: editorStatus,
}

const initialState: PositionsEditorState = {
  open: false,
  status: {
    positionID: 0,
    creating: false,
  },
}

const name = 'positionsEditor'

export const positionsEditorSlice = createSlice({
  name,
  initialState: getLocalStorage(name, initialState) as PositionsEditorState,
  reducers: {
    editorOpened: (state, action: PayloadAction<editorStatus>) => {
      state.open = true
      state.status = action.payload
    },
    editorClosed: (state) => {
      state.open = false
    }
  }
})

export const { editorOpened, editorClosed } = positionsEditorSlice.actions

export default positionsEditorSlice.reducer
