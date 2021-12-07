import { Button } from 'carbon-components-react'
import { useHistory, useParams } from 'react-router-dom'
import { useEffect, useState } from "react"
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


  const dataNull =
    contracts === null ||
    userAddress === null ||
    userEthBalance === null ||
    rewardsInfo === null ||
    poolsMetadata === null ||
    poolCurrentData === null ||
    chainID === null ||
    trustlessMulticall === null

  const position = liquidityPositions === null ? null : liquidityPositions[positionID]

  const pool = (!poolAddress || !poolsMetadata) ? null : poolsMetadata[poolAddress]

  const tick = poolCurrentData ? poolCurrentData.twapTick : null

  const price0 = tickToPriceDisplay(tick === null ? 0 : tick)
  const price1 = tickToPriceDisplay(tick === null ? 0 : -tick)

  const [inverted, setInverted] = useState(false)

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
    poolCurrentData,
    tick
  )

  useEffect(() => {
    if (poolAddress) {
      startCreate({ poolAddress })
    }
  }, [poolAddress])

  const token0IsWeth = pool === null || rewardsInfo === null ? false : pool.token0.address === rewardsInfo.weth
  const token1IsWeth = pool === null || rewardsInfo === null ? false : pool.token1.address === rewardsInfo.weth

  const token0Symbol = displaySymbol(pool ?.token0.symbol)
  const token1Symbol = displaySymbol(pool ?.token1.symbol)
  const poolName = getPoolName(pool)
  const liquidationPenalty = rewardsInfo === null ? '-' : numDisplay(rewardsInfo.liquidationPenalty * 100)

  const toggleInverted = () => setInverted(!inverted)

  const getApprovalButton = (tokenIndex: 0 | 1, token?: tokenMetadata, tokenData?: tokenData, ) => {
    if (token !== undefined && token.symbol.toLowerCase() === 'weth') return null

    const disabled =
      dataNull ||
      token === undefined ||
      pool === null ||
      tokenData === undefined ||
      tokenData.rewardsApproval.approved

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
          tokenAddress: token === undefined ? '' : token.address,
          Rewards: contracts === null ? '' : contracts.Rewards,
          poolAddress,
          symbol,
        }}
      />
    )
  }

  const userToken0Balance =
    token0IsWeth
      ? (userEthBalance === null ? 0 : userEthBalance)
      : (poolCurrentData === null ? 0 : poolCurrentData.token0.userBalance)

  const userToken1Balance =
    token1IsWeth
      ? (userEthBalance === null ? 0 : userEthBalance)
      : (poolCurrentData === null ? 0 : poolCurrentData.token1.userBalance)


  const token0NeedsToBeApproved =
    poolCurrentData === null || token0IsWeth
      ? false
      : token0Amount > 0 && !poolCurrentData.token0.rewardsApproval.approved
  const token1NeedsToBeApproved =
    poolCurrentData === null || token1IsWeth
      ? false
      : token1Amount > 0 && !poolCurrentData.token1.rewardsApproval.approved


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
        position === null || poolCurrentData === null
        ? false
        : poolCurrentData.twapTick < position.tickLower || position.tickUpper < poolCurrentData.twapTick,
    },
  }

  const failureReasons: reason[] = Object.values(failures)
  const isFailing = failureReasons.filter(reason => reason.failing).length > 0

  const token0ApprovalButton = getApprovalButton(0, pool ?.token0, poolCurrentData ?.token0)
  const token1ApprovalButton = getApprovalButton(1, pool ?.token1, poolCurrentData ?.token1)

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
          You want to
          <InputPicker
            options={IncreaseDecreaseOption}
            initialValue={IncreaseDecreaseOption.Increase}
            onChange={onChange}
            label='Increase/Decrease options'
          />
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
          <>
            {token0Symbol} count
          <PositionNumberInput
              id="token0Input"
              action={updateToken0Amount}
              value={token0Amount}
            />
          </>
          <>
            {token1Symbol} count
          <PositionNumberInput
              id="token1Input"
              action={updateToken1Amount}
              value={token1Amount}
            />
          </>
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
      {token0ApprovalButton}
      {token1ApprovalButton}
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
            Rewards: contracts === null ? '' : contracts.Rewards,
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
      You are increasing the liquidity between the prices
      of {position === null ? '-' : tickPriceDisplay(position.tickLower)} {priceUnit} and {position === null ? '-' : tickPriceDisplay(position.tickUpper)} {priceUnit}.

      <ParagraphDivider />
      You want to provide increase
      the {token0Symbol} liquidity by {numDisplay(token0Increase)} and
      the {token1Symbol} liquidity by {numDisplay(token1Increase)}.
      <ParagraphDivider />
      If the {poolName} price moves outside of this price range, You could lose <Bold>{liquidationPenalty}%</Bold> or
      more of your position to liquidators.
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
