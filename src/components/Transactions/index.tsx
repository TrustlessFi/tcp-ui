import { Button, InlineLoading, InlineLoadingStatus } from 'carbon-components-react'
import AppTile from '../library/AppTile'
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import { clearUserTransactions, TransactionStatus, getTxNamePastTense, getTxNamePresentTense } from '../../slices/transactions'
import Center from '../library/Center'
import SimpleTable, { TableHeaderOnly } from '../library/SimpleTable'
import ConnectWalletButton from '../utils/ConnectWalletButton'
import { getSortedUserTxs, UserTxSortOption } from '../utils'
import { getEtherscanTxLink, getEtherscanAddressLink } from '../utils/ExplorerLink'

const txStatusToLoadingStatus: {[key in TransactionStatus]: InlineLoadingStatus} = {
  [TransactionStatus.Pending]: 'active',
  [TransactionStatus.Failure]: 'error',
  [TransactionStatus.Success]: 'finished',
}

const Transactions = () => {
  const dispatch = useAppDispatch()

  const chainID = selector(state => state.chainID)
  const userAddress = selector(state => state.wallet.address)
  const transactions = selector(state => state.transactions)
  const txs = getSortedUserTxs(userAddress, transactions, UserTxSortOption.NONCE_DESCENDING)

  console.log({txs})

  const getDateTimeString = (timeInMS: number) => {
    const date = (new Date(timeInMS))
    return [date.toDateString(), date.toLocaleTimeString()].join(' ')
  }

  const table =
    userAddress === null || txs.length === 0
    ? (
        <div style={{position: 'relative'}}>
          <TableHeaderOnly headers={['Nonce', 'Title', 'Status', 'Start Time']} />
          <Center>
            <div style={{margin: 32}}>
              {userAddress === null
                ? <ConnectWalletButton />
                : <Button onClick={() => window.open(getEtherscanAddressLink(userAddress, chainID.chainID!), '_blank')}>
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
          'Title': tx.status === TransactionStatus.Pending ? getTxNamePresentTense(tx.type) : getTxNamePastTense(tx.type),
          'Status': <InlineLoading status={txStatusToLoadingStatus[tx.status]}/>,
          'Start Time': getDateTimeString(tx.startTimeMS),
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

export default Transactions
