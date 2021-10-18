import { TransactionInfo, TransactionState, getTxNonce } from '../../slices/transactions'
import { AppDispatch } from '../../app/store'
import { clearEthBalance } from '../../slices/ethBalance'
import { clearPositions } from '../../slices/positions'
import { clearHueBalance } from '../../slices/balances/hueBalance'
import { clearLendHueBalance } from '../../slices/balances/lendHueBalance'

export const getSortedUserTxs = (userAddress: string | null, txs: TransactionState | null): TransactionInfo[] => {
  if (userAddress === null) return []
  if (txs === null) return []

  return Object.values(txs)
      .filter(tx => tx.userAddress === userAddress)
      .sort((a, b) => getTxNonce(a) - getTxNonce(b))
}

export const getOpacityTransition = (durationSeconds: number) => {
  const transition = 'opacity ' + durationSeconds + 's ease-in-out'

  return {
      WebkitTransition: transition,
      MozTransition: transition,
      msTransition: transition,
      OTransition: transition,
      transition,
  }
}

export const clearUserData = (dispatch: AppDispatch) => {
  dispatch(clearEthBalance())
  dispatch(clearPositions())
  dispatch(clearHueBalance())
  dispatch(clearLendHueBalance())
}
