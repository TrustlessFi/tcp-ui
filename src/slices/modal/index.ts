import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { txCreatePositionArgs } from '../transactions'

export enum ModalStage {
  Closed,
  Preview,
  WaitingForMetamaskConfirmation,
  WaitingForCompletion,
  Success,
  Failure,
}

interface createPositionModalData {
  args: txCreatePositionArgs,
  ethPrice: number
  liquidationPrice: number
}

export type modalData =
  createPositionModalData | null

export interface ModalState {
  stage: ModalStage
  data: modalData
  hash?: string
  failureMessages?: string[]
}

const name = 'positionsEditor'

export const positionsEditorSlice = createSlice({
  name,
  initialState: {
    stage: ModalStage.Closed,
    modalType: null,
    data: null
  } as ModalState,
  reducers: {
    openModal: (state, action: PayloadAction<modalData>) => {
      if (state.stage === ModalStage.Closed) {
        state.stage = ModalStage.Preview
        state.data = action.payload
      }
    },
    modalWaitingForMetamask: (state) => {
      if (state.stage === ModalStage.Preview) {
        state.stage = ModalStage.WaitingForMetamaskConfirmation
      }
    },
    modalWaitingForCompletion: (state, action: PayloadAction<string>) => {
      if (state.stage === ModalStage.WaitingForMetamaskConfirmation) {
        state.stage = ModalStage.WaitingForCompletion
        state.hash = action.payload
      }
    },
    modalSuccess: (state, action: PayloadAction<string>) => {
      if (state.hash === action.payload && state.stage === ModalStage.WaitingForCompletion) {
        state.stage = ModalStage.Success
      }
    },
    modalFailure: (state, action: PayloadAction<{ hash: string, messages: string[]}>) => {
      if (action.payload.hash === state.hash) {
        state.stage = ModalStage.Failure
        state.failureMessages = action.payload.messages
      }
    },
    closeModal: (state) => {
      state.stage = ModalStage.Closed
      state.data = null
      state.hash = undefined
    }
  }
})

export const {
  openModal,
  modalWaitingForMetamask,
  modalWaitingForCompletion,
  modalSuccess,
  modalFailure,
  closeModal,
} = positionsEditorSlice.actions

export default positionsEditorSlice.reducer
