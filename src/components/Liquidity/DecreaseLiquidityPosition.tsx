import { useState, useEffect, useRef } from 'react'
import { Button, Slider, SliderOnChangeArg } from 'carbon-components-react'
import { useHistory, useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import { getPoolCurrentDataWaitFunction, waitForRewards, waitForPoolsMetadata, waitForContracts, waitForEthBalance, waitForLiquidityPositions } from '../../slices/waitFor'
import { startCreate } from '../../slices/liquidityPositionsEditor'
import { tokenMetadata } from '../../slices/poolsMetadata'
import { tokenData } from '../../slices/poolCurrentData'
import InputPicker from '../library/InputPicker'
import { IncreaseDecreaseOption } from './'
import {
  numDisplay,
  tickToPriceDisplay,
  displaySymbol,
  getPoolName,
  getAmountsForLiquidity,
  bnf,
  unscale
} from '../../utils'
import usePoolDisplayInfo from '../../hooks/usePoolDisplayInfo';
import useLiquidityPositionUpdates from '../../hooks/useLiquidityPositionUpdates';
import PositionNumberInput from '../library/PositionNumberInput'
import LargeText from '../utils/LargeText'
import Bold from '../utils/Bold'
import { reason } from '../library/ErrorMessage';
import ErrorMessage from '../library/ErrorMessage';
import { TransactionType } from '../../slices/transactions/index';
import CreateTransactionButton from '../utils/CreateTransactionButton';
import PositionMetadata2 from '../library/PositionMetadata2'
import TwoColumnDisplay from '../utils/TwoColumnDisplay'
import ParagraphDivider from '../utils/ParagraphDivider'
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

  const contracts = waitForContracts(selector, dispatch)
  const userAddress = selector(state => state.wallet.address)
  const userEthBalance = waitForEthBalance(selector, dispatch)
  const rewardsInfo = waitForRewards(selector, dispatch)
  const poolsMetadata = waitForPoolsMetadata(selector, dispatch)
  const poolCurrentData = getPoolCurrentDataWaitFunction(poolAddress)(selector, dispatch)
  const liquidityPositions = waitForLiquidityPositions(selector, dispatch)

  const chainID = selector(state => state.chainID.chainID)
  const trustlessMulticall = selector(state => state.chainID.trustlessMulticall)

  const [percentageDecrease, setPercentageDecrease] = useState(0)

  const dataNull =
    contracts === null ||
    userAddress === null ||
    userEthBalance === null ||
    rewardsInfo === null ||
    poolsMetadata === null ||
    poolCurrentData === null ||
    chainID === null ||
    liquidityPositions === null ||
    trustlessMulticall === null

  const position = liquidityPositions === null ? null : liquidityPositions[positionID]

  const pool = (!poolAddress || !poolsMetadata) ? null : poolsMetadata[poolAddress]

  const tick = poolCurrentData ? poolCurrentData.twapTick : null

  const price0 = tickToPriceDisplay(tick === null ? 0 : tick)
  const price1 = tickToPriceDisplay(tick === null ? 0 : -tick)

  const {
    inverted, setInverted,
    tickLower, setTickLower,
    tickUpper, setTickUpper
  } = usePoolDisplayInfo(pool, tick)

  const {
    token0Amount,
    token1Amount,
    updateToken0Amount,
    updateToken1Amount
  } = useLiquidityPositionUpdates(tickLower, setTickLower, tickUpper, setTickUpper, poolCurrentData, tick)

  useEffect(() => {
    if (poolAddress) {
      startCreate({ poolAddress })
    }
  }, [poolAddress])

  const toggleInverted = () => setInverted(!inverted)

  const existingTokens =
    poolCurrentData === null  || position === null
    ? {amount0: bnf(0), amount1: bnf(0)}
    : getAmountsForLiquidity(poolCurrentData.instantTick, position.tickLower, position.tickUpper, position.liquidity)

  const token0IsWeth = pool === null || rewardsInfo === null ? false : pool.token0.address === rewardsInfo.weth
  const token1IsWeth = pool === null || rewardsInfo === null ? false : pool.token1.address === rewardsInfo.weth

  const token0Symbol = displaySymbol(pool ?.token0.symbol)
  const token1Symbol = displaySymbol(pool ?.token1.symbol)
  const poolName = getPoolName(pool)
  const liquidationPenalty = rewardsInfo === null ? '-' : numDisplay(rewardsInfo.liquidationPenalty * 100)
  const token0Decimals = pool === null ? 0 : pool.token0.decimals
  const token1Decimals = pool === null ? 0 : pool.token1.decimals

  const currentAmount0 = unscale(existingTokens.amount0, token0Decimals)
  const currentAmount1 = unscale(existingTokens.amount1, token0Decimals)

  const updatePercentageDecrease = (decreasePercentage: number) => {
    setPercentageDecrease(decreasePercentage)

    if (decreasePercentage === 100) {
      updateToken0Amount(currentAmount0)
      updateToken1Amount(currentAmount1)
    } else {
      updateToken0Amount((unscale(existingTokens.amount0, token0Decimals) * decreasePercentage) / 100)
      updateToken1Amount((unscale(existingTokens.amount1, token1Decimals) * decreasePercentage) / 100)
    }
  }

  const userToken0Balance =
    token0IsWeth
      ? (userEthBalance === null ? 0 : userEthBalance)
      : (poolCurrentData === null ? 0 : poolCurrentData.token0.userBalance)

  const userToken1Balance =
    token1IsWeth
      ? (userEthBalance === null ? 0 : userEthBalance)
      : (poolCurrentData === null ? 0 : poolCurrentData.token1.userBalance)

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
  }

  const failureReasons: reason[] = Object.values(failures)
  const isFailing = failureReasons.filter(reason => reason.failing).length > 0

  const priceUnit =
    (inverted ? token0Symbol : token1Symbol) +
    ' per ' +
    (inverted ? token1Symbol : token0Symbol)

  const onChange = (option: IncreaseDecreaseOption) => {
    if (option === IncreaseDecreaseOption.Increase) {
      history.push(['/liquidity', 'increase', poolAddress, positionID].join('/'))
    }
  }

  const newPositionAmount0 = percentageDecrease === 100 ? 0 : currentAmount0 - token0Amount
  const newPositionAmount1 = percentageDecrease === 100 ? 0 : currentAmount1 - token1Amount

  const columnOne =
    <>
      <div style={{ marginBottom: 16 }}>
        <SpacedList spacing={8}>
          You want to
          <InputPicker
            options={IncreaseDecreaseOption}
            initialValue={IncreaseDecreaseOption.Decrease}
            onChange={onChange}
            label='Increase/Decrease options'
          />
          Your position by
          <Slider
            ariaLabelInput="Decrease Percentage"
            id="percentage_slider"
            onChange={(arg: SliderOnChangeArg) => updatePercentageDecrease(arg.value)}
            min={0}
            max={100}
            step={5}
            hideTextInput
            value={percentageDecrease}
          />
          {percentageDecrease + '%'}
        </SpacedList>
      </div>
      <PositionMetadata2 items={[
        {
          title: 'New Wallet ' + token0Symbol + ' Balance',
          value: numDisplay(userToken0Balance + token0Amount),
        }, {
          title: 'New Wallet ' + token1Symbol + ' Balance',
          value: numDisplay(userToken1Balance + token1Amount),
        },{
          title: 'New Position ' + token0Symbol + ' Balance',
          value: numDisplay(newPositionAmount0)
        },{
          title: 'New Position ' + token1Symbol + ' Balance',
          value: numDisplay(newPositionAmount1)
        }
      ]} />
      <div style={{ marginTop: 32, marginBottom: 32 }}>
        {percentageDecrease === 100
        ? <CreateTransactionButton
            disabled={isFailing}
            txArgs={{
              chainID: chainID!,
              type: TransactionType.DeleteLiquidityPosition,
              positionID,
              token0Decrease: token0Amount,
              token0Decimals,
              token1Decrease: token1Amount,
              token1Decimals,
              Rewards: contracts === null ? '' : contracts.Rewards,
              trustlessMulticall: trustlessMulticall!,
            }}
          />
        : <CreateTransactionButton
            disabled={isFailing}
            txArgs={{
              chainID: chainID!,
              type: TransactionType.DecreaseLiquidityPosition,
              positionID,
              token0Decrease: token0Amount,
              token0Decimals,
              token1Decrease: token1Amount,
              token1Decimals,
              liquidity: position === null ? '0' : bnf(position.liquidity).mul(percentageDecrease).div(100).toString(),
              Rewards: contracts === null ? '' : contracts.Rewards,
              trustlessMulticall: trustlessMulticall!,
            }}
          />
        }
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
      {percentageDecrease === 100
        ? `You are deleting position ${positionID} and receiving approximately ` +
          `${numDisplay(currentAmount0)} ${token0Symbol} and ${numDisplay(currentAmount1)} ${token1Symbol} to your wallet.`
        : 'You are decreasing the position liquidity to ' +
          `approximately ${numDisplay(newPositionAmount0)} ${token0Symbol} and ` +
          `${numDisplay(newPositionAmount1)} ${token1Symbol}, and receiving ` +
          `approximately ${numDisplay(token0Amount)} ${token0Symbol} and ` +
          `${numDisplay(token1Amount)} ${token1Symbol} to your wallet.`
      }
    </LargeText>

  return (
    <TwoColumnDisplay
      columnOne={columnOne}
      columnTwo={columnTwo}
      loading={userAddress !== null && dataNull}
      breadCrumbItems={[{ text: 'Liquidity', href: '/liquidity' }, 'Decrease', 'Position ' + numDisplay(positionID)]}
    />
  )
}

export default CreateLiquidityPosition
