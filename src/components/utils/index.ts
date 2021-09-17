import { TransactionInfo, TransactionState } from '../../slices/transactions/index';

export const getSortedUserTxs = (userAddress: string | null, txs: TransactionState | null): TransactionInfo[] => {
  console.log({userAddress, txs})
  if (userAddress === null) return []
  if (txs === null) return []

  if (!txs.hasOwnProperty(userAddress)) return []
  if (Object.values(txs[userAddress]).length === 0) return []

  const userTxs = Object.values(txs[userAddress]).sort((a, b) => a.nonce - b.nonce)
  return userTxs
}
