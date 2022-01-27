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
import { timeMS, minutes, hours, days, weeks } from '../../utils'

const txStatusToLoadingStatus: {[key in TransactionStatus]: InlineLoadingStatus} = {
  [TransactionStatus.Pending]: 'active',
  [TransactionStatus.Failure]: 'error',
  [TransactionStatus.Success]: 'finished',
}

const RecentTransactions = () => {
  const dispatch = useAppDispatch()

  const userAddress = selector(state => state.userAddress)
  const transactions = selector(state => state.transactions)
  const chainID = selector(state => state.chainID)

  const txs = getSortedUserTxs(chainID, userAddress, transactions, UserTxSortOption.NONCE_DESCENDING)

  const getRecencyString = (timeInMS: number) => {
    const getRawString = (secondsAgo: number) => {
      if (secondsAgo <= 0) return 'now'
      if (secondsAgo < minutes(1)) return `${secondsAgo}s`
      if (secondsAgo < hours(1)) return `${Math.floor(secondsAgo/minutes(1))}m`
      if (secondsAgo < days(1)) return `${Math.floor(secondsAgo/hours(1))}h`
      if (secondsAgo < weeks(1)) return `${Math.floor(secondsAgo/days(1))}d`
      return `${Math.floor(secondsAgo/weeks(1))}d`
    }
    return `${getRawString(Math.round((timeMS() - timeInMS) / 1000))} ago`
  }

  const viewOnEtherscanButton = (title = 'View History on Etherscan') =>
    userAddress === null
      ? <ConnectWalletButton size='sm' />
      : <Button
          onClick={() => window.open(getEtherscanAddressLink(userAddress, chainID!), '_blank')}
          size='sm'>
          {title}
        </Button>

  const table =
    userAddress === null || txs.length === 0
    ? (
        <div style={{position: 'relative'}}>
          <TableHeaderOnly headers={['Transaction', 'Start Time', 'Status']} />
          <Center>
            <div style={{margin: 32}}>
              {viewOnEtherscanButton}
            </div>
          </Center>
        </div>
      )
    : <SimpleTable rows={
        txs.map(tx => ({
        key: tx.hash,
        data: {
          'Transaction': getTxLongName(tx.args),
          'Start Time': getRecencyString(tx.startTimeMS),
          'Status': <InlineLoading status={txStatusToLoadingStatus[tx.status]} />,
        },
        onClick: () => window.open(getEtherscanTxLink(tx.hash, chainID!), '_blank'),
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
    <AppTile
      title={tableTitle}
      rightElement={
        <>
          {viewOnEtherscanButton('View on Etherscan')}
          <span style={{marginLeft: 8}}>
            {clearTransactionsButton}
          </span>
        </>
      }
      style={{minWidth: 550}}>
      {table}
    </AppTile>
  )
}

export default RecentTransactions
