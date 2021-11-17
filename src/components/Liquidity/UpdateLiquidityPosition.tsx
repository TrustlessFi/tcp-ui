import { useState } from 'react'
import { useParams } from 'react-router';
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import { getPoolCurrentDataWaitFunction, waitForLiquidityPositions, waitForPoolsMetadata } from '../../slices/waitFor'
import { displaySymbol, getPoolName, tickToPriceDisplay } from '../../utils'
import usePoolDisplayInfo from '../../hooks/usePoolDisplayInfo'
import useLiquidityPositionUpdates from '../../hooks/useLiquidityPositionUpdates'
import InputPicker from '../Lend/library/InputPicker'
import LargeText from '../utils/LargeText'
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

  return (
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
    </LargeText>
  )
}

export default UpdateLiquidityPosition