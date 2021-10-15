import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { getLocalStorage } from '../../utils'

interface editorStatus {
  positionID: number,
  creating: boolean,
}

export interface LiquidityPositionsEditorState {
  open: boolean,
  status: editorStatus,
}

const initialState: LiquidityPositionsEditorState = {
  open: false,
  status: {
    positionID: 0,
    creating: false,
  },
}

const name = 'liquidityPositionsEditor'

// TODO add to local storage

export const liquidityPositionsEditorSlice = createSlice({
  name,
  initialState: getLocalStorage(name, initialState) as LiquidityPositionsEditorState,
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

export const { editorOpened, editorClosed } = liquidityPositionsEditorSlice.actions

export default liquidityPositionsEditorSlice.reducer
