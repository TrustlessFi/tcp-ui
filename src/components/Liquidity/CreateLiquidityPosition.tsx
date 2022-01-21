import { Button } from 'carbon-components-react'
import { useParams } from 'react-router-dom'
import { Subtract16, Add16 } from '@carbon/icons-react';
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import waitFor from '../../slices/waitFor'
import { tokenMetadata } from '../../slices/poolsMetadata'
import {
  numDisplay, getSpaceForFee, tickToPriceDisplay, displaySymbol,
  getPoolName, isZeroish,
} from '../../utils'
import usePoolDisplayInfo from '../../hooks/usePoolDisplayInfo';
import useLiquidityPositionUpdates from '../../hooks/useLiquidityPositionUpdates';
import PositionNumberInput from '../library/PositionNumberInput'
import LargeText from '../library/LargeText'
import Bold from '../library/Bold'
import { reason } from '../library/ErrorMessage';
import ErrorMessage from '../library/ErrorMessage';
import { TransactionType } from '../../slices/transactions/index';
import CreateTransactionButton from '../library/CreateTransactionButton';
import PositionMetadata2 from '../library/PositionMetadata2'
import TwoColumnDisplay from '../library/TwoColumnDisplay'
import ParagraphDivider from '../library/ParagraphDivider'
import SpacedList from '../library/SpacedList'

interface MatchParams {
  poolAddress: string
}

const TickSelector = ({
  tick,
  spacing,
  inverted,
  updateTick,
}: {
    tick: number
    spacing: number
    inverted: boolean
    updateTick: (newTick: number) => void
  }) => (
    <span style={{ marginLeft: 8, marginRight: 8 }}>
      {tickToPriceDisplay(inverted ? -tick : tick)}
      <Button
        style={{ marginLeft: 8 }}
        size="sm"
        hasIconOnly
        kind="secondary"
        renderIcon={Subtract16}
        iconDescription="reduce amount"
        onClick={() => updateTick(inverted ? tick + spacing : tick - spacing)}
      />
      <Button
        size="sm"
        hasIconOnly
        kind="secondary"
        renderIcon={Add16}
        iconDescription="increase amount"
        onClick={() => updateTick(inverted ? tick - spacing : tick + spacing)}
      />
    </span>
  )

TickSelector.defaultProps = { min: false }

const CreateLiquidityPosition = () => {
  const dispatch = useAppDispatch()

  const { poolAddress }: MatchParams = useParams()

  const {
    contracts,
    userAddress,
    balances,
    rewardsInfo,
    poolsMetadata,
    poolsCurrentData,
    currentChainInfo,
  } = waitFor([
    'contracts',
    'userAddress',
    'balances',
    'rewardsInfo',
    'poolsMetadata',
    'poolsCurrentData',
    'currentChainInfo',
  ], selector, dispatch)

  const chainID = selector(state => state.chainID.chainID)
  const trustlessMulticall = selector(state => state.chainID.trustlessMulticall)

  const pool = poolsMetadata === null ? null : poolsMetadata[poolAddress]

  const dataNull =
    contracts === null ||
    userAddress === null ||
    balances === null ||
    rewardsInfo === null ||
    poolsMetadata === null ||
    pool === null ||
    poolsCurrentData === null ||
    currentChainInfo === null ||
    chainID === null ||
    trustlessMulticall === null

  const tick = poolsCurrentData === null ? null : poolsCurrentData[poolAddress].twapTick
  const instantTick = poolsCurrentData === null ? null : poolsCurrentData[poolAddress].instantTick

  const price0 = tickToPriceDisplay(tick === null ? 0 : tick)
  const price1 = tickToPriceDisplay(tick === null ? 0 : -tick)

  const spacing = getSpaceForFee(pool === null ? 0 : pool.fee)

  const {
    inverted, setInverted,
    tickLower, setTickLower,
    tickUpper, setTickUpper
  } = usePoolDisplayInfo(pool, tick)

  const {
    token0Amount,
    token1Amount,
    updateLowerTick,
    updateUpperTick,
    updateToken0Amount,
    updateToken1Amount
  } = useLiquidityPositionUpdates(tickLower, setTickLower, tickUpper, setTickUpper, instantTick, tick)

  const token0IsWeth = pool === null || rewardsInfo === null ? false : pool.token0.address === rewardsInfo.weth
  const token1IsWeth = pool === null || rewardsInfo === null ? false : pool.token1.address === rewardsInfo.weth

  const token0Symbol = displaySymbol(pool?.token0.symbol)
  const token1Symbol = displaySymbol(pool?.token1.symbol)
  const poolName = getPoolName(pool)
  const liquidationPenalty = rewardsInfo === null ? '-' : numDisplay(rewardsInfo.liquidationPenalty * 100)

  const toggleInverted = () => setInverted(!inverted)

  const isZeroishAmount = isZeroish(token0Amount) || isZeroish(token1Amount)

  const getApprovalButton = (tokenIndex: 0 | 1, token: tokenMetadata | null) => {
    if (token !== null && token.symbol.toLowerCase() === 'weth') return null

    const isApproved =
      balances !== null &&
      token !== null &&
      balances.tokens[token.address].approval.Rewards.approved

    if (isApproved) return null

    const disabled =
      balances === null ||
      pool === null ||
      token === null ||
      isZeroishAmount

    const symbol = tokenIndex === 0 ? token0Symbol : token1Symbol

    return (
      <CreateTransactionButton
        key={tokenIndex}
        style={{ marginRight: 8 }}
        title={`Approve ${symbol}`}
        disabled={disabled}
        showDisabledInsteadOfConnectWallet={true}
        shouldOpenTxTab={false}
        txArgs={{
          type: TransactionType.ApprovePoolToken,
          tokenAddress: token === null ? '' : token.address,
          Rewards: contracts === null ? '' : contracts.Rewards,
          poolAddress,
          symbol,
        }}
      />
    )
  }

  const userToken0Balance =
    dataNull
    ? 0
    : (token0IsWeth
      ? balances.userEthBalance
      : balances.tokens[pool.token0.address].userBalance)

  const userToken1Balance =
    dataNull
    ? 0
    : (token1IsWeth
      ? balances.userEthBalance
      : balances.tokens[pool.token1.address].userBalance)

  const token0NeedsToBeApproved =
    poolsCurrentData === null || balances === null || pool === null || token0IsWeth
      ? false
      : token0Amount > 0 && !balances.tokens[pool.token0.address].approval.Rewards.approved

  const token1NeedsToBeApproved =
    poolsCurrentData === null || balances === null || pool === null || token1IsWeth
      ? false
      : token1Amount > 0 && !balances.tokens[pool.token1.address].approval.Rewards.approved

  const failures: { [key in string]: reason } = {
    noop: {
      message: '',
      failing: isZeroishAmount,
      silent: true
    },
    insufficientToken0: {
      message: 'Not enough ' + token0Symbol + '.',
      failing: token0Amount > userToken0Balance,
    },
    insufficientToken1: {
      message: 'Not enough ' + token1Symbol + '.',
      failing: token1Amount > userToken1Balance,
    },
    token0NotApproved: {
      message: 'You must approve ' + token0Symbol,
      failing: token0NeedsToBeApproved,
      silent: true,
    },
    token1NotApproved: {
      message: 'You must approve ' + token1Symbol,
      failing: token1NeedsToBeApproved,
      silent: true,
    },
  }

  const failureReasons: reason[] = Object.values(failures)
  const isFailing = failureReasons.filter(reason => reason.failing).length > 0

  const token0ApprovalButton = getApprovalButton(0, pool === null ? null : pool.token0)
  const token1ApprovalButton = getApprovalButton(1, pool === null ? null : pool.token1)

  const priceUnit =
    (inverted ? token0Symbol : token1Symbol) +
    ' per ' +
    (inverted ? token1Symbol : token0Symbol)

  const amount0Desired = token0Amount
  // TODO tighter or custom range
  const amount0Min = amount0Desired * 0.95
  const amount1Desired = token1Amount
  // TODO tighter or custom range
  const amount1Min = amount1Desired * 0.95


  const columnOne =
    <>
      <div style={{ marginBottom: 16, marginTop: 16 }}>
        <SpacedList spacing={16} style={{marginBottom: 16}}>
          <>
            <Button
              size="sm"
              onClick={toggleInverted}
              kind={inverted ? 'secondary' : 'primary'}>
              {token0Symbol}
            </Button>
            <Button
              size="sm"
              onClick={toggleInverted}
              kind={inverted ? 'primary' : 'secondary'}>
              {token1Symbol}
            </Button>
          </>
          <>{priceUnit} Lower Bound</>
          <LargeText>
            <TickSelector
              tick={inverted ? tickUpper : tickLower}
              updateTick={inverted ? updateUpperTick : updateLowerTick}
              inverted={inverted}
              spacing={spacing}
            />
          </LargeText>
          <>{priceUnit} Upper Bound</>
          <LargeText>
            <TickSelector
              tick={inverted ? tickLower : tickUpper}
              updateTick={inverted ? updateLowerTick : updateUpperTick}
              inverted={inverted}
              spacing={spacing}
            />
          </LargeText>
        </SpacedList>
        <SpacedList spacing={8}>
          <>
            {token0Symbol} count
          </>
            <PositionNumberInput
              id="token0Input"
              action={updateToken0Amount}
              value={token0Amount}
            />
          <>
            {token1Symbol} count
          </>
          <PositionNumberInput
            id="token1Input"
            action={updateToken1Amount}
            value={token1Amount}
          />
        </SpacedList>
      </div>
      <div style={{marginBottom: 16}}>
        <PositionMetadata2 items={[
          {
            title: 'New Wallet ' + token0Symbol + ' Balance',
            value: numDisplay(userToken0Balance - token0Amount),
            failing: userToken0Balance - token0Amount < 0,
          }, {
            title: 'New Wallet ' + token1Symbol + ' Balance',
            value: numDisplay(userToken1Balance - token1Amount),
            failing: userToken1Balance - token1Amount < 0,
          }
        ]} />
      </div>
      {token0ApprovalButton}
      {token1ApprovalButton}
      <div style={{ marginTop: 32, marginBottom: 32 }}>
        <CreateTransactionButton
          disabled={isFailing}
          title='Create Position'
          txArgs={{
            type: TransactionType.CreateLiquidityPosition,
            currentBlockTimestamp: currentChainInfo === null ? 0 : currentChainInfo.blockTimestamp,
            token0: pool === null ? '' : pool.token0.address,
            token0Decimals: pool === null ? 0 : pool.token0.decimals,
            token0IsWeth,
            token1: pool === null ? '' : pool.token1.address,
            token1Decimals: pool === null ? 0 : pool.token1.decimals,
            token1IsWeth,
            fee: pool === null ? 0 : pool.fee,
            chainID: chainID!,
            tickLower,
            tickUpper,
            amount0Desired,
            amount0Min,
            amount1Desired,
            amount1Min,
            trustlessMulticall: trustlessMulticall === null ? '' : trustlessMulticall,
            Rewards: contracts === null ? '' : contracts.Rewards,
          }}
        />
      </div>
      <ErrorMessage reasons={failureReasons} />
    </>

  const tickPriceDisplay = (tick: number) => tickToPriceDisplay(inverted ? -tick : tick)

  const columnTwo =
    <LargeText>
      The current price for the {poolName} pool
      is {inverted ? price1 : price0} {priceUnit}.
      <ParagraphDivider />
      You want to provide liquidity between the prices
      of {tickPriceDisplay(inverted ? tickUpper : tickLower)} {priceUnit} and {tickPriceDisplay(inverted ? tickLower : tickUpper)} {priceUnit}.
      <ParagraphDivider />
      If the {poolName} price moves outside of this price range,
      you could lose <Bold>{liquidationPenalty}%</Bold> or
      more of your position to liquidators.
    </LargeText>


  return (
    <TwoColumnDisplay
      columnOne={columnOne}
      columnTwo={columnTwo}
      loading={userAddress !== null && dataNull}
      breadCrumbItems={[{ text: 'Liquidity', href: '/liquidity' }, 'New']}
    />
  )
}

export default CreateLiquidityPosition
