import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export enum TransactionStatus {
  Pending,
  Failed,
  Succeeded,
}

export type TransactionArgs = {
  hash: string
  title: string
  userAddress: string
  nonce: number
}

export interface TransactionInfo extends TransactionArgs {
  status: TransactionStatus
}

export type TransactionState = {[key in string]: {[key in string]: TransactionInfo}}

export const transactionsSlice = createSlice({
  name: 'transactions',
  initialState: {} as TransactionState,
  reducers: {
    newTransaction: (state, action: PayloadAction<TransactionArgs>) => {
      const newTx = {...action.payload, status: TransactionStatus.Pending}
      if (!state.hasOwnProperty(newTx.userAddress)) state[newTx.userAddress] = {}
      state[newTx.userAddress][newTx.hash] = newTx
    },
    clearTransactions: (state, action: PayloadAction<string>) => {
      state[action.payload] = {}
    },
  }
})

export const { newTransaction, clearTransactions } = transactionsSlice.actions

export default transactionsSlice.reducer
