import { CSSProperties, useState, useEffect } from 'react'
import { Button, InlineLoading, InlineLoadingStatus, Tile, Link } from 'carbon-components-react'
import AppTile from '../library/AppTile'
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import { clearUserTransactions, TransactionStatus, getTxLongName } from '../../slices/transactions'
import Center from '../library/Center'
import SpacedList from '../library/SpacedList'
import Text from '../library/Text'
import LargeText from '../library/LargeText'
import { WalletToken } from '../library/TrustlessLogos'
import { getAddTokenToWalletOnClick } from '../library/AddTokenToWalletButton'
import TokenIcon from '../library/TokenIcon'
import SimpleTable, { TableHeaderOnly } from '../library/SimpleTable'
import { getSortedUserTxs, UserTxSortOption } from '../library'
import { getEtherscanTxLink, getEtherscanAddressLink } from '../library/ExplorerLink'
import { getRecencyString, numDisplay, abbreviateAddress } from '../../utils'
import ProtocolContract from '../../slices/contracts/ProtocolContract'
import waitFor from '../../slices/waitFor'
import { Row, Col } from 'react-flexbox-grid'
import {
  Launch16,
} from '@carbon/icons-react'

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
  info,
}: {
  token: WalletToken
  balance?: number,
  decimals?: number,
  size?: number,
  style?: CSSProperties,
  unit?: string,
  info?: string,
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
        display: 'inline-block',
        cursor: token === WalletToken.Eth ? undefined : 'pointer',
        marginTop: 8,
        marginBottom: 8,
        ...style
      }}
      onClick={
        token === WalletToken.Eth
        ? undefined
        : getAddTokenToWalletOnClick(token, contracts, chainID, userAddress)
      }>
      <SpacedList row spacing={16}>
        <div style={{display:'flex'}}>
          <div style={{height:'100%', marginRight:8, width:size}}>
            <TokenIcon walletToken={token} height={size} width={size}/>
          </div>
          <div style={{width:'auto', paddingTop:4}}>
            <LargeText style={{height:size}}>
              {balance === undefined ? '...' : numDisplay(balance, decimals === undefined ? 2 : decimals)}
            </LargeText>
            {' '}
            {unit === undefined ? token : unit}
            <div style={{lineHeight:1.3, marginTop:8}}>
              {info}
            </div>
          </div>
        </div>
      </SpacedList>
    </Tile>
  )
}

const WalletInfo = () => {

  const {
    balances,
    marketInfo,
    contracts,
    tcpAllocation,
    userAddress,
    chainID,
  } = waitFor([
    'balances',
    'marketInfo',
    'contracts',
    'tcpAllocation',
    'userAddress',
    'chainID',
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
    <Tile style={{ width: 500, padding: 40 }}>
      <SpacedList spacing={32}>
        <SpacedList spacing={16}>
          <LargeText size={28}>
            My Wallet
          </LargeText>
          {
            userAddress === null || chainID === null
            ? <div />
            : <Link href={getEtherscanAddressLink(userAddress, chainID)} target='_blank'>
                <Text monospace>
                  {abbreviateAddress(userAddress)}
                </Text>
              </Link>
          }
        </SpacedList>
        <Center>
          <SpacedList style={{width: '100%'}}>
            <TokenCard
              token={WalletToken.TruEth}
              decimals={4}
              size={28}
              style={{ paddingLeft: 20, paddingRight: 20, paddingTop: 12, paddingBottom: 12 }}
              balance={balances === null ? undefined : balances.userEthBalance}
              info='TruEth can be used as collateral within Trustless.'
            />
            <TokenCard
              token={WalletToken.Hue}
              balance={getBalance(ProtocolContract.Hue)}
              info='Hue is a stablecoin. Hue may be staked into the protocol to earn interest.'
            />
            <TokenCard
              token={WalletToken.LendHue}
              unit='Hue Staked'
              balance={hueStaked}
              info='The value of Hue you have staked into the protocol.'
            />
            <TokenCard
              token={WalletToken.Tcp}
              balance={tcpAllocationCount}
              info='Tcp allows holders to govern the Tcp protocol.'
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
        <SpacedList spacing={20}>
          <div style={{marginLeft: 40}}>
          {
            userAddress === null || chainID === null
            ? <div />
            : <Link href={getEtherscanAddressLink(userAddress, chainID)} target='_blank'>
                <Text monospace>
                  {abbreviateAddress(userAddress)}
                </Text>
              </Link>
          }
          </div>
          {table}
        </SpacedList>
      </AppTile>
    </SpacedList>
    </Center>
  )
}

export default RecentTransactions
