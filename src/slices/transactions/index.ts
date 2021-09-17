import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import { executeUpdateTransactions } from './api';

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

export interface updateTransactionsArgs {
  currentState: TransactionState
  userAddress: string
}

export const updateTransactions = createAsyncThunk(
  'transactions/updateTransactions',
  async (args: updateTransactionsArgs, {dispatch}) => await executeUpdateTransactions(args, dispatch),
)


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
    transactionSucceeded: (state, action: PayloadAction<{userAddress: string, hash: string}>) => {
      state[action.payload.userAddress][action.payload.hash].status = TransactionStatus.Succeeded
    },
    transactionFailed: (state, action: PayloadAction<{userAddress: string, hash: string}>) => {
      state[action.payload.userAddress][action.payload.hash].status = TransactionStatus.Failed
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateTransactions.fulfilled, (state, action) => {
        state = action.payload
      })
  },
})

export const {
  newTransaction,
  clearTransactions,
  transactionSucceeded,
  transactionFailed,
} = transactionsSlice.actions

export default transactionsSlice.reducer
