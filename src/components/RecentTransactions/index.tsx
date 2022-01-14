import { Button, InlineLoading, InlineLoadingStatus } from 'carbon-components-react'
import AppTile from '../library/AppTile'
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import { clearUserTransactions, TransactionStatus, getTxLongName, getTokenAssociatedWithTx } from '../../slices/transactions'
import Center from '../library/Center'
import AddTokenToWalletButton from '../library/AddTokenToWalletButton'
import SimpleTable, { TableHeaderOnly } from '../library/SimpleTable'
import ConnectWalletButton from '../library/ConnectWalletButton'
import { getSortedUserTxs, UserTxSortOption } from '../library'
import { getEtherscanTxLink, getEtherscanAddressLink } from '../library/ExplorerLink'
import { getChainIDFromState } from '../../slices/chainID'

const txStatusToLoadingStatus: {[key in TransactionStatus]: InlineLoadingStatus} = {
  [TransactionStatus.Pending]: 'active',
  [TransactionStatus.Failure]: 'error',
  [TransactionStatus.Success]: 'finished',
}

const RecentTransactions = () => {
  const dispatch = useAppDispatch()

  const userAddress = selector(state => state.wallet.address)
  const transactions = selector(state => state.transactions)
  const chainID = selector(state => state.chainID)

  const txs = getSortedUserTxs(getChainIDFromState(chainID), userAddress, transactions, UserTxSortOption.NONCE_DESCENDING)

  const getDateTimeString = (timeInMS: number) => {
    const date = (new Date(timeInMS))
    return [date.toDateString(), date.toLocaleTimeString()].join(' ')
  }

  const table =
    userAddress === null || txs.length === 0
    ? (
        <div style={{position: 'relative'}}>
          <TableHeaderOnly headers={['Nonce', 'Transaction', 'Start Time', '', 'Status']} />
          <Center>
            <div style={{margin: 32}}>
              {userAddress === null
                ? <ConnectWalletButton size='sm' />
                : <Button
                    onClick={() => window.open(getEtherscanAddressLink(userAddress, chainID.chainID!), '_blank')}
                    size='sm'>
                    View History on Etherscan
                  </Button>
              }
            </div>
          </Center>
        </div>
      )
    : <SimpleTable rows={
        txs.map(tx => ({
        key: tx.hash,
        data: {
          'Nonce': tx.nonce,
          'Transaction': getTxLongName(tx.args),
          'Start Time': getDateTimeString(tx.startTimeMS),
          '': <AddTokenToWalletButton walletToken={getTokenAssociatedWithTx(tx.type)} />,
          'Status': <InlineLoading status={txStatusToLoadingStatus[tx.status]} />,
        },
        onClick: () => window.open(getEtherscanTxLink(tx.hash, chainID.chainID!), '_blank'),
      }))
    } />

  const clearTransactionsButton =
    userAddress === null || txs.length === 0
    ? null
    : <Button
        small
        kind="tertiary"
        onClick={() => dispatch(clearUserTransactions(userAddress))}>
        Clear all
      </Button>

  const tableTitle = 'Recent Transactions (' + txs.length + ')'

  return (
    <AppTile title={tableTitle} rightElement={clearTransactionsButton}>
      {table}
    </AppTile>
  )
}

export default RecentTransactions
