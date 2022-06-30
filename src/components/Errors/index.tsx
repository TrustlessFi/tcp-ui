import { AppDispatch } from '../../app/store'
import {
  addError,
  reportableError,
} from '../../slices/errors'

export enum ErrorType {
  WalletConnectError = 'WalletConnectError',
  TransactionError = 'TransactionError',
  WaitForError = 'WaitForError',
  RenderError = 'RenderError',
  RootRenderError = 'RootRenderError',
}

export const reportError = (
  error: reportableError,
  dispatch: AppDispatch,
) => {
  console.error(error.error)
  dispatch(addError(error))
}
