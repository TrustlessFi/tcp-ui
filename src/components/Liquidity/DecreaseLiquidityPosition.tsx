import { useState, useEffect, useRef } from 'react'
import { Button, Slider, SliderOnChangeArg } from 'carbon-components-react'
import { useHistory, useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import { getPoolCurrentDataWaitFunction, waitForRewards, waitForPoolsMetadata, waitForContracts, waitForEthBalance } from '../../slices/waitFor'
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

  const chainID = selector(state => state.chainID.chainID)
  const trustlessMulticall = selector(state => state.chainID.trustlessMulticall)

  const [percentageDecrease, setPercentageDecrease] = useState(50)

  const dataNull =
    contracts === null ||
    userAddress === null ||
    userEthBalance === null ||
    rewardsInfo === null ||
    poolsMetadata === null ||
    poolCurrentData === null ||
    chainID === null ||
    trustlessMulticall === null

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

  if (!poolAddress || !poolCurrentData) {
    return <span />
  }

  const token0IsWeth = pool === null || rewardsInfo === null ? false : pool.token0.address === rewardsInfo.weth
  const token1IsWeth = pool === null || rewardsInfo === null ? false : pool.token1.address === rewardsInfo.weth

  const token0Symbol = displaySymbol(pool ?.token0.symbol)
  const token1Symbol = displaySymbol(pool ?.token1.symbol)
  const poolName = getPoolName(pool)

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

  const token0Increase = token0Amount
  const token1Increase = token1Amount

  const onChange = (option: IncreaseDecreaseOption) => {
    if (option === IncreaseDecreaseOption.Increase) {
      history.push(['/liquidity', 'increase', poolAddress, positionID].join('/'))
    }
  }

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
            onChange={(arg: SliderOnChangeArg) => setPercentageDecrease(arg.value)}
            min={0}
            max={100}
            step={1}
            hideTextInput
            value={percentageDecrease}
          />
          {percentageDecrease + '%'}
        </SpacedList>
      </div>
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
      <div style={{ marginTop: 32, marginBottom: 32 }}>
        <CreateTransactionButton
          disabled={isFailing}
          txArgs={{
            chainID: chainID!,
            type: TransactionType.IncreaseLiquidityPosition,
            positionID,
            token0Increase,
            token0Decimals: pool === null ? 0 : pool.token0.decimals,
            token0IsWeth,
            token1Increase,
            token1Decimals: pool === null ? 0 : pool.token1.decimals,
            token1IsWeth,
            Rewards: contracts!.Rewards,
            trustlessMulticall: trustlessMulticall!,
          }}
        />
      </div>
      <ErrorMessage reasons={failureReasons} />
    </>

  const tickPriceDisplay = (tick: number) => tickToPriceDisplay(inverted ? -tick : tick)

  const columnTwo =
    <LargeText>
      The current price for the
          {' '}{poolName}{' '}
      pool is {inverted ? price1 : price0} {priceUnit}.
      <ParagraphDivider />
      {percentageDecrease === 100
        ? `You want to delete position ${positionID} and receive all liquidity back to your wallet.`
        : `You want to decrease the liquidity by ${percentageDecrease}%, receiving the proceeds to your wallet.`
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
