import { Button } from 'carbon-components-react'
import AppTile from '../library/AppTile'
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import { getTxHash, clearUserTransactions, TransactionStatus, getTxNamePastTense, getTxNamePresentTense } from '../../slices/transactions'
import Center from '../library/Center'
import SimpleTable, { TableHeaderOnly } from '../library/SimpleTable'
import ConnectWalletButton from '../utils/ConnectWalletButton'
import { getSortedUserTxs } from '../utils/index';
import { getEtherscanTxLink, getEtherscanAddressLink } from '../utils/ExplorerLink'

const Transactions = () => {
  const dispatch = useAppDispatch()

  const chainID = selector(state => state.chainID)
  const userAddress = selector(state => state.wallet.address)
  const transactions = selector(state => state.transactions)
  const txs = getSortedUserTxs(userAddress, transactions)

  const table =
    userAddress === null || txs.length === 0
    ? (
        <div style={{position: 'relative'}}>
          <TableHeaderOnly headers={['Title', 'Status']} />
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
        key: getTxHash(tx),
        data: {
          'Title': tx.status === TransactionStatus.Pending ? getTxNamePresentTense(tx.type) : getTxNamePastTense(tx.type),
          'Status': tx.status,
        },
        onClick: () => window.open(getEtherscanTxLink(getTxHash(tx), chainID.chainID!), '_blank'),
      }))
    } />

  const clearTransactionsButton =
    userAddress === null || txs.length === 0
    ? null
    : <Button onClick={() => dispatch(clearUserTransactions(userAddress))}>Clear all</Button>

  const tableTitle = 'Recent Transactions (' + txs.length + ')'

  return (
    <AppTile title={tableTitle} rightElement={clearTransactionsButton}>
      {table}
    </AppTile>
  )
}

export default Transactions
