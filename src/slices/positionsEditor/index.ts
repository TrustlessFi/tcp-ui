import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface editorStatus {
  positionID: number,
  creating: boolean,
  isGenesis: boolean,
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
    isGenesis: false,
  },
}

export const positionsEditorSlice = createSlice({
  name: 'positionsEditor',
  initialState,
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
