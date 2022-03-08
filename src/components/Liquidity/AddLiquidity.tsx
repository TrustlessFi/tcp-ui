import { useState, useEffect } from "react"
import { useHistory } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import { red } from '@carbon/colors';
import { tokenMetadata } from '../../slices/poolsMetadata'
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import waitFor from '../../slices/waitFor'
import { roundToXDecimals, getE18PriceForSqrtX96Price, bnf, unscale } from '../../utils/'
import SpacedList from '../library/SpacedList'
import CreateTransactionButton from '../library/CreateTransactionButton'
import Text from '../library/Text'
import LargeText from '../library/LargeText'
import Bold from '../library/Bold'
import RelativeLoading from '../library/RelativeLoading'
import FullNumberInput from '../library/FullNumberInput'
import Center from '../library/Center'
import { Tile, Button } from 'carbon-components-react'
import { TransactionType } from '../../slices/transactions'

interface AddLiquidityParams {
  poolIDString: string
}

const AddLiquidity = () => {
  const dispatch = useAppDispatch()
  const history = useHistory()

  const poolIDString = useParams<AddLiquidityParams>().poolIDString

  const [token0Count, setToken0Count] = useState(0)
  const [token1Count, setToken1Count] = useState(0)
  // TODO remove?
  const [isToken0Focused, setIsToken0Focused] = useState(false)
  const [isToken1Focused, setIsToken1Focused] = useState(false)

  const {
    liquidityPage,
    poolsCurrentData,
    poolsMetadata,
    balances,
    contracts,
  } = waitFor([
    'liquidityPage',
    'poolsCurrentData',
    'poolsMetadata',
    'balances',
    'contracts',
  ], selector, dispatch)

  const txCostBuffer = 0.05

  const dataNull =
    poolsCurrentData === null ||
    poolsMetadata === null

  const matchingPools =
    poolsMetadata === null
    ? []
    : Object.entries(poolsMetadata).map(([address, pool]) => ({
        ...pool,
        address,
      })).filter(pool => pool.poolIDString === poolIDString)

  useEffect(() => {
    if (poolsMetadata !== null && matchingPools.length === 0) {
      history.push('/liquidity')
    }
  }, [matchingPools])

  useEffect(() => {
    if (liquidityPage.liquidityPageNonce !== 0) {
      history.push('/liquidity')
    }
  }, [liquidityPage.liquidityPageNonce])

  if (dataNull || matchingPools.length === 0 ) {
    return (
      <Center style={{ position: 'relative', marginTop: 40 }}>
        <RelativeLoading show={true} />
        <Tile style={{width: 200, height: 200}} />
      </Center>
    )
  }

  const pool = matchingPools[0]
  const poolPrice = unscale(getE18PriceForSqrtX96Price(bnf(poolsCurrentData[pool.address].sqrtPriceX96)))

  const round = (value: number, decimals = 4, roundDown = true) =>
    parseFloat(roundToXDecimals(value, decimals, roundDown))

  const countToken0Updated = (value: number) => {
    setToken0Count(round(value))
    setToken1Count(round(value * poolPrice))
  }

  const countToken1Updated = (value: number) => {
    setToken1Count(round(value))
    setToken0Count(round(value / poolPrice))
  }

  const token0IsWeth = pool.token0.symbol.toLowerCase() === 'weth'
  const token1IsWeth = pool.token1.symbol.toLowerCase() === 'weth'

  const token0UserBalance =
      balances === null
      ? null
      : (token0IsWeth
        ? balances.userEthBalance
        : balances.tokens[pool.token0.address].userBalance)

  const token0Approved =
      balances === null || contracts === null
      ? null
      : (token0IsWeth
        ? true
        : balances.tokens[pool.token0.address].approval.Rewards.approved)

  const token1UserBalance =
      balances === null
      ? null
      : (token1IsWeth
        ? balances.userEthBalance
        : balances.tokens[pool.token1.address].userBalance)

  const token1Approved =
      balances === null || contracts === null
      ? null
      : (token1IsWeth
        ? true
        : balances.tokens[pool.token1.address].approval.Rewards.approved)

  const exceedsToken0Balance = token0UserBalance !== null && token0UserBalance < token0Count
  const exceedsToken1Balance = token1UserBalance !== null && token1UserBalance < token1Count

  const token0UserBalanceDisplay =
    token0UserBalance === null
    ? '-'
    : roundToXDecimals(token0UserBalance, token0IsWeth ? 4 : 2, true)

  const token1UserBalanceDisplay =
    token1UserBalance === null
    ? '-'
    : roundToXDecimals(token1UserBalance, token1IsWeth ? 4 : 2, true)

  const missingBalance =
    token0UserBalance === null ||
    token0UserBalance === 0 ||
    token1UserBalance === null ||
    token1UserBalance === 0

  const setMaxForToken0 = () => {
    if (missingBalance) {
      setToken0Count(0)
      setToken1Count(0)
      return
    } else {
      const amount =
        token0IsWeth
        ? Math.max(0, token0UserBalance - txCostBuffer)
        : token0UserBalance
      countToken0Updated(amount)
    }
  }

  const setMaxForToken1 = () => {
    if (missingBalance) {
      setToken0Count(0)
      setToken1Count(0)
      return
    } else {
      const amount =
        token1IsWeth
        ? Math.max(0, token1UserBalance - txCostBuffer)
        : token1UserBalance
      countToken1Updated(amount)
    }
  }

  const noInput = token0Count === 0 && token1Count === 0

  const getApproveButton = (token: tokenMetadata, approval: boolean | null) =>
    <CreateTransactionButton
      title={`Approve ${token.displaySymbol}`}
      size='md'
      disabled={approval !== false || contracts === null || noInput}
      showDisabledInsteadOfConnectWallet
      txArgs={{
        type: TransactionType.ApprovePoolToken,
        tokenAddress: token.address,
        Rewards: contracts === null ? '' : contracts.Rewards,
        symbol: token.displaySymbol,
      }}
    />

  const approveToken0Button = getApproveButton(pool.token0, token0Approved)
  const approveToken1Button = getApproveButton(pool.token1, token1Approved)

  const addLiquidityButton =
    <CreateTransactionButton
      disabled={dataNull || noInput || exceedsToken0Balance || exceedsToken1Balance || contracts === null}
      size='md'
      txArgs={{
        type: TransactionType.AddLiquidity,
        poolID: pool.poolID,
        Rewards: contracts === null ? '' : contracts.Rewards,
        token0: {
          count: token0Count,
          decimals: pool.token0.decimals,
          isWeth: token0IsWeth,
        },
        token1: {
          count: token1Count,
          decimals: pool.token1.decimals,
          isWeth: token1IsWeth,
        }
      }}
    />

  return (
    <Center style={{marginTop: 40}}>
      <Tile style={{width: 500, padding: 40}}>
        <SpacedList spacing={40}>
          <LargeText>Add {pool.title} Liquidity</LargeText>
          <FullNumberInput
            title={pool.token0.displaySymbol}
            action={countToken0Updated}
            value={token0Count}
            unit={pool.token0.displaySymbol}
            light
            frozen={false}
            defaultButton={{ title: 'Max', action: setMaxForToken0 }}
            onFocusUpdate={setIsToken0Focused}
            subTitle={
              <Text>
                You have
                {' '}
                <Bold>
                  <Text color={exceedsToken0Balance ? red[50] : undefined}>
                    {token0UserBalanceDisplay}
                  </Text>
                </Bold>
                {' '}
                {pool.token0.displaySymbol} in your wallet
              </Text>
            }
          />
          <FullNumberInput
            title={pool.token1.displaySymbol}
            action={countToken1Updated}
            value={token1Count}
            unit={pool.token1.displaySymbol}
            light
            frozen={false}
            defaultButton={{ title: 'Max', action: setMaxForToken1 }}
            onFocusUpdate={setIsToken1Focused}
            subTitle={
              <Text>
                You have
                {' '}
                <Bold>
                  <Text color={exceedsToken1Balance ? red[50] : undefined}>
                    {token1UserBalanceDisplay}
                  </Text>
                </Bold>
                {' '}
                {pool.token1.displaySymbol} in your wallet
              </Text>
            }
          />
          <SpacedList row spacing={10}>
            {
              token0Approved === false
              ? approveToken0Button
              : (token1Approved === false
                ? approveToken1Button
                : addLiquidityButton)
            }
            <Button
              size='md'
              kind='secondary'
              onClick={() => history.push('/liquidity')}>
              Cancel
            </Button>
          </SpacedList>
        </SpacedList>
      </Tile>
    </Center>
  )
}

export default AddLiquidity
