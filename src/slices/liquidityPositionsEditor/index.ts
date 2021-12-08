import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { getLocalStorage } from '../../utils'

export enum LiquidityPositionEditorStatus {
  Closed,
  Create,
  Edit,
}

interface LiquidityPositionEditorClosedState {
  status: LiquidityPositionEditorStatus.Closed
  poolAddress?: string
}

interface LiquidityPositionEditorCreateState {
  status: LiquidityPositionEditorStatus.Create
  poolAddress: string
}

interface LiquidityPositionEditorEditState {
  status: LiquidityPositionEditorStatus.Edit
  positionID: string
  poolAddress?: string
}

type LiquidityPositionsEditorState =
  LiquidityPositionEditorClosedState |
  LiquidityPositionEditorCreateState |
  LiquidityPositionEditorEditState

const initialState: LiquidityPositionsEditorState = {
  status: LiquidityPositionEditorStatus.Closed
}


// TODO delete this file
const name = 'liquidityPositionsEditor'

export const liquidityPositionsEditorSlice = createSlice({
  name,
  // TODO add to local storage
  initialState: getLocalStorage(name, initialState) as LiquidityPositionsEditorState,
  reducers: {
    startCreate: (_state, action: PayloadAction<{ poolAddress: string}>) => {
      return {
        status: LiquidityPositionEditorStatus.Create,
        ...action.payload
      }
    },
    startEdit: (_state, action: PayloadAction<{ positionID: string}>) => {
      return {
        status: LiquidityPositionEditorStatus.Edit,
        ...action.payload
      }
    },
    close: (_state) => {
      return initialState
    }
  }
})

export const { startCreate, startEdit, close } = liquidityPositionsEditorSlice.actions

export default liquidityPositionsEditorSlice.reducer
