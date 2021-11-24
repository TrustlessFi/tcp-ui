import { useState } from 'react'
import { useParams } from 'react-router'
import { Percent, Token } from '@uniswap/sdk-core'
import { FeeAmount, Pool, Position, TickMath } from '@uniswap/v3-sdk'
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import { waitForContracts, getPoolCurrentDataWaitFunction, waitForLiquidityPositions, waitForPoolsMetadata } from '../../slices/waitFor'
import { bnf, displaySymbol, getPoolName, SLIPPAGE_TOLERANCE, tickToPriceDisplay } from '../../utils'
import usePoolDisplayInfo from '../../hooks/usePoolDisplayInfo'
import useLiquidityPositionUpdates from '../../hooks/useLiquidityPositionUpdates'
import InputPicker from '../Lend/library/InputPicker'
import Breadcrumbs from '../library/Breadcrumbs'
import LargeText from '../utils/LargeText'
import { TransactionArgs, TransactionType, txDecreaseLiquidityPositionArgs, txIncreaseLiquidityPositionArgs } from '../../slices/transactions';
import CreateTransactionButton from '../utils/CreateTransactionButton'
import PositionNumberInput from '../library/PositionNumberInput'

enum ChangeType {
  Increase = 'Increase',
  Decrease = 'Decrease',
}

interface MatchParams {
  positionID: string
}

const UpdateLiquidityPosition = () => {
  const params: MatchParams = useParams()
  const dispatch = useAppDispatch();

  const chainID = selector(state => state.chainID.chainID)
  const trustlessMulticall = selector(state => state.chainID.trustlessMulticall)

  const contracts = waitForContracts(selector, dispatch)
  const liquidityPositions = waitForLiquidityPositions(selector, dispatch)
  const poolsMetadata = waitForPoolsMetadata(selector, dispatch)


  const position = liquidityPositions && liquidityPositions[params.positionID]
  const pool = poolsMetadata && position && Object.values(poolsMetadata).find(pool => pool.poolID === position.poolID)
  const poolCurrentData = getPoolCurrentDataWaitFunction(pool?.address || '')(selector, dispatch)
  const tick = poolCurrentData ? poolCurrentData.twapTick : null
  const price0 = tickToPriceDisplay(tick === null ? 0 : tick)
  const price1 = tickToPriceDisplay(tick === null ? 0 : -tick)
  const token0Symbol = displaySymbol(pool?.token0.symbol)
  const token1Symbol = displaySymbol(pool?.token1.symbol)

  const [changeType, setChangeType] = useState(ChangeType.Increase)
  const [decreasePercentage, setDecreasePercentage] = useState(0)

  const {
    inverted,
    tickLower, setTickLower,
    tickUpper, setTickUpper
  } = usePoolDisplayInfo(pool, tick)

  const {
      token0Amount,
      token1Amount,
      updateToken0Amount,
      updateToken1Amount
  } = useLiquidityPositionUpdates(tickLower, setTickLower, tickUpper, setTickUpper, poolCurrentData, tick)

  const priceUnit =
    (inverted ? token0Symbol : token1Symbol) +
    ' per ' +
    (inverted ? token1Symbol : token0Symbol)

  const displayUpper = tickToPriceDisplay((inverted ? position?.tickUpper : position?.tickLower) || 0)
  const displayLower = tickToPriceDisplay((inverted ? position?.tickLower : position?.tickUpper) || 0)

  let txArgs = {
    chainID: chainID!,
    positionID: Number(position?.positionID),
    trustlessMulticall,
    Rewards: contracts!.Rewards,
  }

  if(changeType === ChangeType.Increase && chainID && pool && poolCurrentData) {
    txArgs = {
      ...txArgs,
      type: TransactionType.IncreaseLiquidityPosition,
      amount0Change: token0Amount,
      amount1Change: token1Amount,
    } as txIncreaseLiquidityPositionArgs
  } else if(chainID && pool && poolCurrentData) {
    const token0 = new Token(chainID, pool.token0.address, pool.token0.decimals)
    const token1 = new Token(chainID, pool.token1.address, pool.token1.decimals)
    const uniswapPool = new Pool(
      token0,
      token1,
      pool.fee as unknown as FeeAmount,
      TickMath.getSqrtRatioAtTick(poolCurrentData.twapTick),
      position.liquidity,
      poolCurrentData.twapTick
    )
    const uniswapPosition = new Position({
      pool: uniswapPool,
      liquidity: bnf(position.liquidity).mul(decreasePercentage || 0).div(100).toString(),
      tickLower,
      tickUpper,
    })

    const { amount0: amount0Min, amount1: amount1Min } = uniswapPosition.burnAmountsWithSlippage(new Percent(SLIPPAGE_TOLERANCE * 100, 100))

    txArgs = {
      ...txArgs,
      type: TransactionType.DecreaseLiquidityPosition,
      liquidity: Number(uniswapPosition.liquidity.toString()),
      amount0Min: Number(String(amount0Min)),
      amount1Min: Number(String(amount1Min)),
    } as txDecreaseLiquidityPositionArgs
  }

  return (
    <>
      <Breadcrumbs items={[{ text: 'Liquidity', href: '/liquidity' }, 'Update']} />
      <LargeText>
        The current price for the {getPoolName(pool)} pool is {inverted ? price1 : price0} {priceUnit}.
        <br />
        Liquidity position #{position?.positionID} is providing liquidity between {displayLower} and {displayUpper} {priceUnit}.
        <br />
        I want to
        <InputPicker
          options={ChangeType}
          initialValue={ChangeType.Increase}
          onChange ={(option: ChangeType) => setChangeType(option)}
        />
        liquidity by
        {changeType === ChangeType.Increase ? (
          <>
            <PositionNumberInput
              id='amount0Input'
              action={(value: number) => updateToken0Amount(value)}
              value={token0Amount}
            />
            Eth and
            <PositionNumberInput
              id='amount1Input'
              action={(value: number) => updateToken1Amount(value)}
              value={token1Amount}
            />
            Hue.
          </>
        ) : (
          <>
            <PositionNumberInput
              id='decreasePercentageInput'
              action={(value: number) => setDecreasePercentage(value)}
              value={decreasePercentage}
            />
            %
          </>
        )}
        <br />
        {position && (
          <CreateTransactionButton
            disabled={false}
            txArgs={txArgs as TransactionArgs}
          />
        )}
      </LargeText>
    </>
  )
}

export default UpdateLiquidityPosition
