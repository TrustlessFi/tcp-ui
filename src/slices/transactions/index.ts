import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import { getLocalStorage } from '../../utils'
import getProvider from '../../utils/getProvider'
import { addNotification } from '../notifications'

export enum TransactionStatus {
  Pending,
  Failed,
  Succeeded,
  UnexpectedError,
}

export type TransactionArgs = {
  hash: string
  message: string
  userAddress: string
  nonce: number
}

export interface TransactionInfo extends TransactionArgs {
  status: TransactionStatus
}

export type TransactionState = {[key in string]: TransactionInfo}

export interface updateTransactionsArgs {
  currentState: TransactionState
  userAddress: string
}

export interface updateTransactionsResponse {
  success: boolean
}

export const waitForTransaction = createAsyncThunk(
  'transactions/waitForTransaction',
  async (args: TransactionArgs, {dispatch}): Promise<TransactionInfo> => {
    const provider = getProvider()!

    const receipt = await provider.waitForTransaction(args.hash)
    const status = receipt.status === 1 ? TransactionStatus.Succeeded : TransactionStatus.Failed

    const result = {...args, status}

    dispatch(addNotification(result))

    return result
  })

const name = 'transactions'

export const transactionsSlice = createSlice({
  name,
  initialState: getLocalStorage(name, {}) as TransactionState,
  reducers: {
    clearUserTransactions: (state, action: PayloadAction<string>) => {
      const userAddress = action.payload
      const validTxs = Object.values(state).filter(tx => tx.userAddress !== userAddress)
      state = {}
      validTxs.map(tx => state[tx.hash] = tx)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(waitForTransaction.pending, (state, action) => {
        state[action.meta.arg.hash] = {
          ...action.meta.arg,
          status: TransactionStatus.Pending,
        }
      })
      .addCase(waitForTransaction.rejected, (state, action) => {
        state[action.meta.arg.hash].status = TransactionStatus.UnexpectedError
      })
      .addCase(waitForTransaction.fulfilled, (state, action) => {
        state[action.meta.arg.hash].status = action.payload.status
      })
  },
})

export const { clearUserTransactions } = transactionsSlice.actions

export default transactionsSlice.reducer
