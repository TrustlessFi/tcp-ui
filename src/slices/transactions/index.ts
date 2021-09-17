import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { initialState, sliceState } from '../'

export enum TransactionStatus {
  Pending,
  Failed,
  Succeeded,
}

export type TransactionArgs = {
  hash: string
  title: string
}

export interface TransactionInfo extends TransactionArgs {
  status: TransactionStatus
}

export interface TransactionsState extends sliceState<TransactionInfo[]> {}

export const transactionsSlice = createSlice({
  name: 'transactions',
  initialState: initialState as TransactionsState,
  reducers: {
    newTransaction: (state, action: PayloadAction<TransactionArgs>) => {
      const newTx = {...action.payload, status: TransactionStatus.Pending}
      if (state.data.value === null) state.data.value = [newTx]
      else state.data.value.push(newTx)
    },
    clearTransactions: (state) => {
      state.data.value = []
    },
  }
})

export const { newTransaction, clearTransactions } = transactionsSlice.actions

export default transactionsSlice.reducer
