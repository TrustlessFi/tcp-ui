import { updateTransactionsArgs, transactionSucceeded, transactionFailed } from './'
import { AppDispatch } from '../../app/store'

import getProvider from '../../utils/getProvider'
import { TransactionState , TransactionStatus } from './index';
import { getSortedUserTxs } from '../../components/utils/index';


export const executeUpdateTransactions = async (
  args: updateTransactionsArgs,
  dispatch: AppDispatch,
): Promise<TransactionState> => {
  const provider = getProvider()
  if (provider === null) return args.currentState

  let txs = getSortedUserTxs(args.userAddress, args.currentState)
  if (txs.length === 0) return args.currentState

  const newState = args.currentState

  await Promise.all(txs.map(async tx => {
    if (tx.status === TransactionStatus.Failed || tx.status === TransactionStatus.Succeeded) return
    const txObject = await provider.getTransaction(tx.hash)
    if (txObject.confirmations > 0) {
      const receipt = await provider.getTransactionReceipt(tx.hash)
      receipt.status === 1
        ? dispatch(transactionSucceeded({userAddress: args.userAddress, hash: tx.hash }))
        : dispatch(transactionFailed({userAddress: args.userAddress, hash: tx.hash }))
    }
  }))

  return newState
}

  /*
  const state = store.getState()

  const userAddress = state.wallet.address
  const sdi = state.systemDebt.data.value
  const marketInfo = state.market.data.value

  if (userAddress === null) throw 'User Address null on create position'
  if (sdi === null) throw 'Sdi null on create position'
  if (marketInfo === null) throw 'MarketInfo null on create position'

  dispatch(getPositions({chainID, userAddress, sdi, marketInfo}))
  */
