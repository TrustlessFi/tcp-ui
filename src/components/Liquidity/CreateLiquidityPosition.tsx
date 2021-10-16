import { Button } from 'carbon-components-react'
import { Subtract16, Add16 } from '@carbon/icons-react';
import { useState, useEffect, useRef } from "react"
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import { waitForPoolMetadata, waitForPoolTicks } from '../../slices/waitFor'
import { numDisplay, getSpaceForFee, tickToPrice } from '../../utils'
import { nearestUsableTick } from '@uniswap/v3-sdk'
import PositionNumberInput from '../library/PositionNumberInput'
import RelativeLoading from '../library/RelativeLoading'
import LargeText from '../utils/LargeText'
import Bold from '../utils/Bold'

// TODO put into utils?
const tickToPriceDisplay = (tick: number) => numDisplay(tickToPrice(tick))

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
  <span style={{marginLeft: 8, marginRight: 8}}>
    {tickToPriceDisplay(inverted ? -tick : tick)}
    <Button
      style={{marginLeft: 8}}
      small
      hasIconOnly
      kind="secondary"
      renderIcon={Subtract16}
      onClick={() => updateTick(inverted ? tick + spacing : tick - spacing)}
    />
    <Button
      small
      hasIconOnly
      kind="secondary"
      renderIcon={Add16}
      onClick={() => updateTick(inverted ? tick - spacing : tick + spacing)}
    />
  </span>
)

TickSelector.defaultProps = {min: false}

const CreateLiquidityPosition = ({ poolAddress }: { poolAddress: string }) => {
  const dispatch = useAppDispatch()

  const poolTicks = waitForPoolTicks(selector, dispatch)
  const poolMetadata = waitForPoolMetadata(selector, dispatch)

  const pool = poolMetadata !== null ? poolMetadata[poolAddress] : null
  const tick = poolTicks !== null ? poolTicks[poolAddress] : null
  const price0 = tickToPriceDisplay(tick === null ? 0 : tick)
  const price1 = tickToPriceDisplay(tick === null ? 0 : -tick)

  const spacing = getSpaceForFee(pool === null ? 0 : pool.fee)
  const nearestTick = nearestUsableTick(tick === null ? 0 : tick, spacing)

  const nextLowest = tick === null ? null : nearestTick < tick ? nearestTick : nearestTick - spacing
  const nextHighest = tick === null ? null : nearestTick > tick ? nearestTick : nearestTick + spacing

  const [inverted, setInverted] = useState(false)
  const [lowerTick, setLowerTick] = useState(0)
  const [upperTick, setUpperTick] = useState(0)
  const [token0Amount, setToken0Amount] = useState(0)
  const [token1Amount, setToken1Amount] = useState(0)

  const isDataLoadedRef = useRef(false)

  useEffect(() => {
    if (!isDataLoadedRef.current && tick !== null && nextLowest !== null && nextHighest !== null) {
      isDataLoadedRef.current = true

      setInverted(tick < 0)
      setLowerTick(nextLowest)
      setUpperTick(nextHighest)
    }
  })

  const displaySymbol = (value: string) => {
    if (value.toLowerCase() === 'weth') return 'Eth'
    if (value.length === 0) return value
    return value.substr(0, 1).toUpperCase() + value.substr(1).toLowerCase()
  }

  const token0Symbol = pool === null ?  '-' : displaySymbol(pool.token0.symbol)
  const token1Symbol = pool === null ?  '-' : displaySymbol(pool.token1.symbol)

  const poolName = pool === null ? '-' : token0Symbol + ':' + token1Symbol

  const toggleInverted = () => setInverted(!inverted)

  const updateLowerTick = (newTick: number) => setLowerTick(tick !== null && newTick < tick ? newTick : lowerTick)
  const updateUpperTick = (newTick: number) => setUpperTick(tick !== null && newTick > tick ? newTick : upperTick)

  const priceUnit =
    (inverted ? token0Symbol : token1Symbol) +
    ' per ' +
    (inverted ? token1Symbol : token0Symbol)

  return (
    <div style={{position: 'relative'}}>
      <RelativeLoading show={poolTicks === null || poolMetadata === null} />
      <div style={{marginBottom: 16}}>
        <Button
          small
          onClick={toggleInverted}
          kind={inverted ? 'secondary' : 'primary'}>
          {token0Symbol}
        </Button>
        <Button
          small
          onClick={toggleInverted}
          kind={inverted ? 'primary' : 'secondary'}>
          {token1Symbol}
        </Button>
      </div>
      <LargeText>
        The current price for the
        {' '}{poolName}{' '}
        pool is {inverted ? price1 : price0} {priceUnit}.
        <div />
        I want to provide liquidity between the prices of
        <TickSelector
          tick={inverted ? upperTick : lowerTick}
          updateTick={inverted ? updateUpperTick : updateLowerTick}
          inverted={inverted}
          spacing={spacing}
        />
        and
        <TickSelector
          tick={inverted ? lowerTick : upperTick}
          updateTick={inverted ? updateLowerTick : updateUpperTick}
          inverted={inverted}
          spacing={spacing}
        />
        {priceUnit}, by depositing
        <PositionNumberInput
          id="token0Input"
          action={(value: number) => setToken0Amount(value)}
          value={token0Amount}
        />
        {token0Symbol} and
        <PositionNumberInput
          id="token1Input"
          action={(value: number) => setToken1Amount(value)}
          value={token1Amount}
        />
        {token1Symbol}.
        <div />
        If the {poolName} price moves outside of this liquidity range, I could lose <Bold>{numDisplay(123.34)}%</Bold> of
        my position value to liquidators.
      </LargeText>
    </div>
  )
}

export default CreateLiquidityPosition
