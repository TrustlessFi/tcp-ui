import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export enum TxStage {
  Standby,
  AwaitingPreviewApproval,
  AwaitingConfirmation,
  TxSubmitted,
}

export enum TxType {
  CreatePosition,
}

type transactionData = {
  mediumName: string
  shortName: string
}

export interface createPositionPreview extends transactionData {
  collateral: string,
  debt: string,
  ethPrice: string,
  liquidationPrice: string,
}

export type txData = {
  type: TxType
  description: createPositionPreview
  args: any[],
  value: string,
}

export interface TxState {
  stage: TxStage
  data: txData | null
}

const initialState: TxState = { stage: TxStage.Standby, data: null }

export const txSlice = createSlice({
  name: 'tx',
  initialState,
  reducers: {
    start: (state, action: PayloadAction<txData>) => {
      state.stage = TxStage.AwaitingPreviewApproval
      state.data = action.payload
    },
    cancel: (state) => {
      console.log("CANCELLINg")
      state.stage = TxStage.Standby
      state.data = null
    },
    awaitConfirmation: (state) => {
      console.log("CONFIRMING")
      state.stage = TxStage.AwaitingConfirmation
    },
    txSubmitted: (state) => {
      state.stage = TxStage.TxSubmitted
    },
  },
  extraReducers: () => {},
});

export const { start, cancel, awaitConfirmation, txSubmitted } = txSlice.actions

export default txSlice.reducer
