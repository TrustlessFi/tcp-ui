import { Button } from 'carbon-components-react'
import { useHistory, useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import waitFor from '../../slices/waitFor'
import { tokenMetadata } from '../../slices/fetchNodes'
import InputPicker from '../library/InputPicker'
import { IncreaseDecreaseOption } from './'
import {
  numDisplay,
  tickToPriceDisplay,
  displaySymbol,
  getAmountsForLiquidity,
  bnf,
  unscale,
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
  positionID: string
  poolAddress: string
}

const CreateLiquidityPosition = () => {
  const dispatch = useAppDispatch()
  const history = useHistory()

  const params: MatchParams = useParams()
  const positionID = Number(params.positionID)
  const poolAddress = params.poolAddress

  const {
    contracts,
    userAddress,
    balances,
    rewardsInfo,
    poolsMetadata,
    poolsCurrentData,
    currentChainInfo,
    liquidityPositions,
  } = waitFor([
    'contracts',
    'userAddress',
    'balances',
    'rewardsInfo',
    'poolsMetadata',
    'poolsCurrentData',
    'currentChainInfo',
    'liquidityPositions',
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
    chainID === null ||
    liquidityPositions === null ||
    currentChainInfo === null ||
    trustlessMulticall === null

  const position = liquidityPositions === null ? null : liquidityPositions[positionID]

  const tick = poolsCurrentData === null ? null : poolsCurrentData[poolAddress].twapTick
  const instantTick = poolsCurrentData === null ? null : poolsCurrentData[poolAddress].instantTick

  const price0 = tickToPriceDisplay(tick === null ? 0 : tick)
  const price1 = tickToPriceDisplay(tick === null ? 0 : -tick)

  const existingTokens =
    poolsCurrentData === null  || position === null
    ? {amount0: bnf(0), amount1: bnf(0)}
    : getAmountsForLiquidity(poolsCurrentData[poolAddress].instantTick, position.tickLower, position.tickUpper, position.liquidity)

  const token0Decimals = pool === null ? 0 : pool.token0.decimals
  const token1Decimals = pool === null ? 0 : pool.token1.decimals

  const {
    inverted, setInverted,
  } = usePoolDisplayInfo(pool, tick)

  const {
    token0Amount,
    token1Amount,
    updateToken0Amount,
    updateToken1Amount
  } = useLiquidityPositionUpdates(
    position === null ? 0 : position.tickLower,
    () => {},
    position === null ? 0 : position.tickUpper,
    () => {},
    instantTick,
    tick
  )

  const token0IsWeth = pool === null || rewardsInfo === null ? false : pool.token0.address === rewardsInfo.weth
  const token1IsWeth = pool === null || rewardsInfo === null ? false : pool.token1.address === rewardsInfo.weth

  const token0Symbol = displaySymbol(pool?.token0.symbol)
  const token1Symbol = displaySymbol(pool?.token1.symbol)
  const liquidationPenalty = rewardsInfo === null ? '-' : numDisplay(rewardsInfo.liquidationPenalty * 100)

  const toggleInverted = () => setInverted(!inverted)

  const getApprovalButton = (tokenIndex: 0 | 1, token: tokenMetadata | null) => {
    if (token !== null && token.symbol.toLowerCase() === 'weth') return null

    const isApproved =
      balances === null
      || pool === null
      || token === null
      ? null
      : balances.tokens[token.address].approval.Rewards.approved

    const disabled =
      dataNull ||
      token === undefined ||
      pool === null ||
      isApproved === true

    const symbol = tokenIndex === 0 ? token0Symbol : token1Symbol

    return (
      <CreateTransactionButton
        key={tokenIndex}
        style={{ marginRight: 8 }}
        title={"Approve " + symbol}
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
      failing: isNaN(token0Amount) || token0Amount === 0 || isNaN(token1Amount) || token1Amount === 0,
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
    },
    token1NotApproved: {
      message: 'You must approve ' + token1Symbol,
      failing: token1NeedsToBeApproved,
    },
    liquidityOutOfRange: {
      message: 'Can\'t increase out of range liquidity.',
      failing:
        position === null || poolsCurrentData === null
        ? false
        : poolsCurrentData[poolAddress].twapTick < position.tickLower || position.tickUpper < poolsCurrentData[poolAddress].twapTick,
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

  const token0Increase = token0Amount
  const token1Increase = token1Amount

  const onChange = (option: IncreaseDecreaseOption) => {
    if (option === IncreaseDecreaseOption.Decrease) {
      history.push(['/liquidity', 'decrease', poolAddress, positionID].join('/'))
    }
  }

  const columnOne =
    <>
      <div style={{ marginBottom: 16 }}>
        <SpacedList spacing={8}>
          <div style={{marginBottom: 16}}>
            <InputPicker
              options={IncreaseDecreaseOption}
              initialValue={IncreaseDecreaseOption.Increase}
              onChange={onChange}
              label='Increase/Decrease options'
            />
          </div>
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
          },{
            title: 'New Wallet ' + token1Symbol + ' Balance',
            value: numDisplay(userToken1Balance - token1Amount),
            failing: userToken1Balance - token1Amount < 0,
          },{
            title: 'New Position ' + token0Symbol + ' Balance',
            value: numDisplay(unscale(existingTokens.amount0, token0Decimals) + token0Amount)
          },{
            title: 'New Position ' + token1Symbol + ' Balance',
            value: numDisplay(unscale(existingTokens.amount1, token1Decimals) + token1Amount)
          }
        ]} />
      </div>
      {token0ApprovalButton}
      {token1ApprovalButton}
      <div style={{ marginTop: 32, marginBottom: 32 }}>
        <CreateTransactionButton
          disabled={isFailing}
          txArgs={{
            chainID: chainID!,
            type: TransactionType.IncreaseLiquidityPosition,
            currentBlockTimestamp: currentChainInfo === null ? 0 : currentChainInfo.blockTimestamp,
            positionID,
            token0Increase,
            token0Decimals: pool === null ? 0 : pool.token0.decimals,
            token0IsWeth,
            token1Increase,
            token1Decimals: pool === null ? 0 : pool.token1.decimals,
            token1IsWeth,
            Rewards: contracts === null ? '' : contracts.Rewards,
            trustlessMulticall: trustlessMulticall!,
          }}
        />
      </div>
      <ErrorMessage reasons={failureReasons} />
    </>

  const tickPriceDisplay = (lower: boolean) => {
    if (position === null) return 0
    const tick = lower
      ? (inverted ? -position.tickUpper : position.tickLower)
      : (inverted ? -position.tickLower : position.tickUpper)
    return tickToPriceDisplay(tick)
  }

  const columnTwo =
    <LargeText>
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
      <ParagraphDivider />
      Position {positionID} has
      approximately {numDisplay(unscale(existingTokens.amount0, token0Decimals))} {token0Symbol} and
      {' '}{numDisplay(unscale(existingTokens.amount1, token1Decimals))} {token1Symbol}
      {' '}between the prices of
      of {position === null ? '-' : tickPriceDisplay(true)} and {position === null ? '-' : tickPriceDisplay(false)} {priceUnit}.
      <ParagraphDivider />
      The current
      {' '}{priceUnit}
      {' '}price is {inverted ? price1 : price0}.
      If the {priceUnit} price moves outside of the position's price range, you could lose <Bold>{liquidationPenalty}%</Bold> or
      more of your position to liquidators.
      <ParagraphDivider />
      You are increasing the liquidity to
      approximately {numDisplay(unscale(existingTokens.amount0, token0Decimals) + token0Increase)} {token0Symbol} and
      {' '}{numDisplay(unscale(existingTokens.amount1, token1Decimals) + token1Increase)} {token1Symbol}.
    </LargeText>

  return (
    <TwoColumnDisplay
      columnOne={columnOne}
      columnTwo={columnTwo}
      loading={userAddress !== null && dataNull}
      breadCrumbItems={[{ text: 'Liquidity', href: '/liquidity' }, 'Increase', 'Position ' + numDisplay(positionID)]}
    />
  )
}

export default CreateLiquidityPosition
