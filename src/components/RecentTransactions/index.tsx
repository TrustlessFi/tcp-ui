import { useHistory } from 'react-router-dom'
import { CSSProperties, useState, useEffect } from 'react'
import { Button, InlineLoading, InlineLoadingStatus, Tile } from 'carbon-components-react'
import AppTile from '../library/AppTile'
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import { clearUserTransactions, TransactionStatus, getTxLongName } from '../../slices/transactions'
import Center from '../library/Center'
import SpacedList from '../library/SpacedList'
import LargeText from '../library/LargeText'
import { WalletToken } from '../library/TrustlessLogos'
import { getAddTokenToWalletOnClick } from '../library/AddTokenToWalletButton'
import TokenIcon from '../library/TokenIcon'
import SimpleTable, { TableHeaderOnly } from '../library/SimpleTable'
import { getSortedUserTxs, UserTxSortOption } from '../library'
import { getEtherscanTxLink } from '../library/ExplorerLink'
import { getRecencyString, numDisplay } from '../../utils'
import ProtocolContract from '../../slices/contracts/ProtocolContract'
import waitFor from '../../slices/waitFor'
import { Row, Col } from 'react-flexbox-grid'
import { Tab, tabToPath } from '../../App'
import { setTab } from '../../slices/tabs'

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
  onClick,
}: {
  token: WalletToken
  balance?: number,
  decimals?: number,
  size?: number,
  style?: CSSProperties,
  unit?: string,
  onClick?: () => void
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
        width: '100%',
        marginRight: 16,
        marginBottom: 16,
        display: 'inline-block',
        cursor: token === WalletToken.Eth ? undefined : 'pointer',
        padding: 20,
        height: 60,
        ...style
      }}
      onClick={
        onClick === undefined
        ? getAddTokenToWalletOnClick(token, contracts, chainID, userAddress)
        : onClick
      }>
      <SpacedList row spacing={16}>
        <span style={{verticalAlign: 'middle'}}>
          <TokenIcon walletToken={token} width={size} />
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
  const dispatch = useAppDispatch()
  const history = useHistory()

  const {
    balances,
    marketInfo,
    contracts,
    tcpAllocation,
  } = waitFor([
    'balances',
    'marketInfo',
    'contracts',
    'tcpAllocation',
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

  const tcpAllocationCount =
    tcpAllocation === null
    ? undefined
    : tcpAllocation.totalAllocation - tcpAllocation.tokensAllocated

  return (
    <Tile style={{ width: 500, padding: 32 }}>
      <SpacedList spacing={32}>
        <LargeText>
          Balances
        </LargeText>
        <Center>
          <SpacedList style={{width: '100%'}}>
            <TokenCard
              token={WalletToken.Eth}
              decimals={4}
              size={28}
              style={{ paddingLeft: 20, paddingRight: 20, paddingTop: 12, paddingBottom: 12 }}
              balance={balances === null ? undefined : balances.userEthBalance}
              onClick={undefined}
            />
            <TokenCard
              token={WalletToken.Hue}
              balance={getBalance(ProtocolContract.Hue)}
            />
            <TokenCard
              token={WalletToken.LendHue}
              unit='Hue Staked'
              balance={hueStaked}
            />
            <TokenCard
              token={WalletToken.Tcp}
              balance={getBalance(ProtocolContract.Tcp)}
            />
            <TokenCard
              token={WalletToken.Tcp}
              unit='Tcp Allocation'
              balance={tcpAllocationCount}
              onClick={() => {
                // TODO abstract this interface
                history.push(tabToPath(Tab.AllocateTcp))
                dispatch(setTab(Tab.AllocateTcp))
              }}
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
        rightElement={clearTransactionsButton}
        style={{ minWidth: 500 }}>
        {table}
      </AppTile>
    </SpacedList>
    </Center>
  )
}

export default RecentTransactions
