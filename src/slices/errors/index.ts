import { createLocalSlice, CacheDuration } from '../'
import { RootState } from '../fetchNodes'
import { PayloadAction } from '@reduxjs/toolkit'
import { timeS, getUUID } from '../../utils'
import { TransactionInfo } from '../transactions'

export interface reportableError {
  error: {} | string
  errorType: string
  address?: string
  chainId?: number
  transactionInfo?: TransactionInfo
}

type TcpUIError = {
  error: {}
  errorType: string
  address: string
  chainId: number
  timestamp: number
  errorId: string
  sessionId: string
  transactionInfo: {}
}

export type errorsState = {
  errors: TcpUIError[]
  sessionId: string | null
}

const initialState: errorsState = {errors: [], sessionId: null}

const walletSlice = createLocalSlice({
  name: 'errors',
  initialState,
  stateSelector: (state: RootState) => state.errors,
  cacheDuration: CacheDuration.INFINITE,
  reducers: {
    addError: (state, action: PayloadAction<reportableError>) => {
      const { error, errorType, address, chainId, transactionInfo } = action.payload
      if (state.sessionId === null) {
        state.sessionId = getUUID()
      }
      state.errors.push({
        error: typeof error === 'string' ? { message: error } : error,
        errorType: errorType,
        address: address === undefined ? '' : address,
        chainId: chainId === undefined ? 0 : chainId,
        timestamp: timeS(),
        errorId: getUUID(),
        sessionId: state.sessionId,
        transactionInfo: transactionInfo === undefined ? {} : transactionInfo
      })
    },
    removeErrors: (state, action: PayloadAction<string[]>) => {
      const errorIds = action.payload
      state.errors = state.errors.filter(e => !errorIds.includes(e.errorId))
    }
  },
})

export const {
  addError,
  removeErrors,
} = walletSlice.slice.actions

export default walletSlice
