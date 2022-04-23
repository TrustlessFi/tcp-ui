import { CSSProperties, useState, useEffect } from 'react'
import { Button, InlineLoading, InlineLoadingStatus, Tile, Link } from 'carbon-components-react'
import AppTile from '../library/AppTile'
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import { clearUserTransactions, TransactionStatus, getTxLongName } from '../../slices/transactions'
import Center from '../library/Center'
import SpacedList from '../library/SpacedList'
import Text from '../library/Text'
import LargeText from '../library/LargeText'
import OneColumnDisplay from '../library/OneColumnDisplay'
import { WalletToken } from '../library/TrustlessLogos'
import { getAddTokenToWalletOnClick } from '../library/AddTokenToWalletButton'
import TokenIcon from '../library/TokenIcon'
import TitleText from '../library/TitleText'
import TrustlessTooltip from '../library/TrustlessTooltip'
import SimpleTable, { TableHeaderOnly } from '../library/SimpleTable'
import { getSortedUserTxs, UserTxSortOption } from '../library'
import { getEtherscanTxLink, getEtherscanAddressLink } from '../library/ExplorerLink'
import { getRecencyString, numDisplay, abbreviateAddress } from '../../utils'
import ProtocolContract from '../../slices/contracts/ProtocolContract'
import waitFor from '../../slices/waitFor'
import { Row, Col } from 'react-flexbox-grid'
import { isMobile } from 'react-device-detect'

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
  tooltip,
}: {
  token: WalletToken
  balance?: number,
  decimals?: number,
  size?: number,
  style?: CSSProperties,
  unit?: string,
  tooltip?: string,
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

  const [ isHover, setIsHover ] = useState(false)

  return (
    <Tile
      light
      style={{
        width: '100%',
        display: 'inline-block',
        cursor: token === WalletToken.Eth ? undefined : 'pointer',
        padding: 16,
        backgroundColor: isHover ? '#494949' : undefined,
        ...style
      }}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      onClick={
        token === WalletToken.Eth
        ? undefined
        : getAddTokenToWalletOnClick(token, contracts, chainID, userAddress)
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
          <>
            {unit === undefined ? token : unit}
            {
              tooltip === undefined
              ? null
              : <span style={{marginLeft: 4, position: 'relative', top: '3px'}}>
                  <TrustlessTooltip text={tooltip} />
                </span>
            }
          </>
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

  const horizontalPadding = isMobile ? {} : {paddingLeft: 40, paddingRight: 40}

  return (
    <SpacedList style={{width: '100%', ...horizontalPadding}} spacing={10}>
      <TokenCard
        token={WalletToken.TruEth}
        decimals={4}
        size={28}
        style={{ paddingLeft: 20, paddingRight: 20, paddingTop: 12, paddingBottom: 12 }}
        balance={balances === null ? undefined : balances.userEthBalance}
        tooltip='TruEth is used as collateral to borrow Hue on the Position tab.'
      />
      <TokenCard
        token={WalletToken.Hue}
        balance={getBalance(ProtocolContract.Hue)}
        tooltip='Hue is a stablecoin that is generated after locking TruEth collateral under the Position tab. Hue may be staked into the protocol to earn interest under the Stake tab.'
      />
      <TokenCard
        token={WalletToken.LendHue}
        unit='Hue Staked'
        balance={hueStaked}
        tooltip='The value of Hue you have staked into the protocol under the Stake tab.'
      />
      <TokenCard
        token={WalletToken.Tcp}
        balance={tcpAllocationCount}
        tooltip='Tcp allows holders to govern the Tcp protocol throught a governance process. Ask the community to learn more.'
      />
    </SpacedList>
  )
}

/*
const TweetTile = () => {
  return (
    <Tile style={{ width: 500, paddingLeft: 40, paddingRight: 40, paddingTop: 20, paddingBottom: 40 }}>
      <SpacedList spacing={20}>
        <>
          <Center>
            <a href='https://twitter.com/trustlessfi' target='_blank' >
              <LogoTwitter32 width={64} height={64} />
            </a>
          </Center>
          <Center>
            <LargeText>
              Tweet Trustless
            </LargeText>
          </Center>
        </>
        <SpacedList spacing={20}>
          {
            Object.keys(TweetType).reverse().filter(t => !isNaN(Number(t))).map(t => Number(t) as TweetType).map(t =>
              <Tile light style={{display: 'flex'}}>
                  <div style={{width: 280}}>
                    <Text lineHeight={1.5}>
                      {getTweetElement(t)}
                    </Text>
                  </div>
                  <div style={{alignSelf: 'center', marginLeft: 20}}>
                    <Center>
                      <ComposeTweetButton tweetType={t} />
                    </Center>
                  </div>
              </Tile>
            )
          }
        </SpacedList>
      </SpacedList>
    </Tile>
  )
}
*/


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
      : <SimpleTable
          rows={
            txs.map(tx => ({
              key: tx.hash,
              data: {
                'Description':
                  <Row middle='xs'>
                    <Col style={{paddingLeft: 10, paddingRight: 10}}>
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
          }
        />

  return (
    <OneColumnDisplay>
      <Tile style={{paddingTop: 40, paddingLeft: 0, paddingRight: 0, paddingBottom: 0}}>
        <SpacedList spacing={40}>
          <TitleText style={{margin: 40}}>My Wallet</TitleText>
          <WalletInfo />
          <div style={{margin: 40}}>
            <SpacedList spacing={5}>
              <div style={{display: 'float', alignItems: 'center'}}>
                <div style={{float: 'right'}}>
                  <Center>
                    {
                      userAddress === null
                      ? null
                      : <Button
                          small
                          kind='tertiary'
                          disabled={txs.length === 0}
                          onClick={() => dispatch(clearUserTransactions(userAddress))}>
                          Clear
                        </Button>
                    }
                  </Center>
                </div>
                <div>
                  <LargeText>
                    Transactions ({txs.length})
                  </LargeText>
                  <div>
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
                </div>
              </div>
            </SpacedList>
          </div>
          {
            txs.length === 0
            ? <div style={{height: 1}}/>
            : table
          }
        </SpacedList>
      </Tile>
    </OneColumnDisplay>
  )
}

export default RecentTransactions
