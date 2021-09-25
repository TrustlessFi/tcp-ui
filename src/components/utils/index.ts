import { TransactionInfo, TransactionState, getTxNonce } from '../../slices/transactions'

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
