import { CSSProperties, useState, useEffect } from 'react'
import { Button, InlineLoading, InlineLoadingStatus, Tile } from 'carbon-components-react'
import AppTile from '../library/AppTile'
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import { clearUserTransactions, TransactionStatus, getTxLongName, WalletToken } from '../../slices/transactions'
import Center from '../library/Center'
import SpacedList from '../library/SpacedList'
import LargeText from '../library/LargeText'
import { TokenIcon, getAddTokenToWalletOnClick } from '../library/AddTokenToWalletButton'
import SimpleTable, { TableHeaderOnly } from '../library/SimpleTable'
import { getSortedUserTxs, UserTxSortOption } from '../library'
import { getEtherscanTxLink } from '../library/ExplorerLink'
import { getRecencyString, numDisplay } from '../../utils'
import ProtocolContract from '../../slices/contracts/ProtocolContract'
import waitFor from '../../slices/waitFor'
import { Row, Col } from 'react-flexbox-grid'

const txStatusToLoadingStatus: { [key in TransactionStatus]: InlineLoadingStatus } = {
  [TransactionStatus.Pending]: 'active',
  [TransactionStatus.Failure]: 'error',
  [TransactionStatus.Success]: 'finished',
}

const TokenCard = ({
  token,
  balance,
  decimals,
  size,
  style,
  unit,
}: {
  token: WalletToken | 'Eth',
  balance?: number,
  decimals?: number,
  size?: number,
  style?: CSSProperties,
  unit?: string,
}) => {
  const {
    chainID,
    userAddress,
    contracts,
  } = waitFor([
    'chainID',
    'userAddress',
    'contracts',
  ], selector, useAppDispatch())

  return (
    <Tile
      light
      style={{
        minWidth: 300,
        marginRight: 16,
        marginBottom: 16,
        display: 'inline-block',
        cursor: token === 'Eth' ? undefined : 'pointer',
        padding: 20,
        ...style
      }}
      onClick={token === 'Eth' ? undefined : getAddTokenToWalletOnClick(token, contracts, chainID, userAddress)}>
      <SpacedList row spacing={16}>
        <span style={{verticalAlign: 'middle'}}>
          <TokenIcon walletToken={token} size={size} />
        </span>
        <>
          <LargeText>
            {balance === undefined ? '...' : numDisplay(balance, decimals === undefined ? 2 : decimals)}
          </LargeText>
          {' '}
          {unit === undefined ? token : unit}
        </>
      </SpacedList>
    </Tile>
  )
}

const WalletInfo = () => {

  const {
    balances,
    marketInfo,
    contracts,
  } = waitFor([
    'balances',
    'marketInfo',
    'contracts',
  ], selector, useAppDispatch())

  const getBalance = (contract: ProtocolContract) =>
    contracts === null || balances === null
      ? undefined
      : balances.tokens[contracts[contract]].userBalance

  const hueStaked =
    balances === null ||
    contracts === null ||
    marketInfo === null
    ? undefined
    : balances.tokens[contracts.LendHue].userBalance * marketInfo.valueOfLendTokensInHue

  return (
    <Tile style={{ minWidth: 550, padding: 32 }}>
      <SpacedList spacing={32}>
        <LargeText>
          Balances
        </LargeText>
        <Center>
          <SpacedList>
            <TokenCard
              token='Eth'
              decimals={4}
              size={28}
              style={{ paddingLeft: 20, paddingRight: 20, paddingTop: 12, paddingBottom: 12 }}
              balance={balances === null ? undefined : balances.userEthBalance}
            />
            <TokenCard
              token={WalletToken.Hue}
              balance={getBalance(ProtocolContract.Hue)}
            />
            <TokenCard
              token={WalletToken.Hue}
              unit='Hue Staked'
              balance={hueStaked}
            />
            <TokenCard
              token={WalletToken.Tcp}
              balance={getBalance(ProtocolContract.Tcp)}
            />
          </SpacedList>
        </Center>
      </SpacedList>
    </Tile>
  )
}

/*
const ViewOnEtherscanButton = ({
  title,
}: {
  title?: string
}) => {
  const {
    userAddress,
    chainID,
  } = waitFor([
    'userAddress',
    'chainID',
  ], selector, useAppDispatch())

  return (
    userAddress === null || chainID === null
      ? <ConnectWalletButton size='sm' />
      : <Button
        onClick={() => window.open(getEtherscanAddressLink(userAddress, chainID), '_blank')}
        size='sm'>
        {title === undefined ? 'View on Etherscan' : title}
      </Button>
  )
}
*/

const RecentTransactions = () => {
  const dispatch = useAppDispatch()

  const {
    userAddress,
    transactions,
    chainID,
  } = waitFor([
    'userAddress',
    'transactions',
    'chainID',
  ], selector, dispatch)

  const getTimeDisplays = () =>
    Object.fromEntries(
      Object.values(transactions)
        .map((tx) => [tx.hash, getRecencyString(tx.startTimeMS)]))

  const [ timeDisplays, setTimeDisplays ] = useState<{[txHash: string]: string}>(getTimeDisplays())

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeDisplays(getTimeDisplays())
    }, 200)
    return () => clearInterval(interval)
  })

  const txs = getSortedUserTxs(chainID, userAddress, transactions, UserTxSortOption.NONCE_DESCENDING)

  const table =
    userAddress === null || txs.length === 0
      ? (
        <div style={{ position: 'relative' }}>
          <TableHeaderOnly headers={['Description', 'Start Time']} />
        </div>
      )
      : <SimpleTable rows={
        txs.map(tx => ({
          key: tx.hash,
          data: {
            'Description':
              <Row middle='xs'>
                <Col style={{paddingLeft: 8, paddingRight: 8}}>
                  <InlineLoading status={txStatusToLoadingStatus[tx.status]} style={{display: 'inline'}}/>
                </Col>
                <Col>
                  {getTxLongName(tx.args)}
                </Col>
              </Row>,
            'Start Time': timeDisplays[tx.hash] === undefined ? '-' : timeDisplays[tx.hash],
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
        Clear
      </Button>

  const tableTitle = 'Recent Transactions (' + txs.length + ')'

  return (
    <Center>
    <SpacedList spacing={32} style={{marginTop: 32, width: 500}}>
      <WalletInfo />
      <AppTile
        title={tableTitle}
        rightElement={
            clearTransactionsButton
        }
        style={{ minWidth: 550 }}>
        {table}
      </AppTile>
    </SpacedList>
    </Center>
  )
}

export default RecentTransactions
