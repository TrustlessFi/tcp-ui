import { Button } from 'carbon-components-react'
import { useState, useEffect, useRef } from "react"
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import { waitForPoolMetadata, waitForPoolTicks } from '../../slices/waitFor'
import { numDisplay, getSpaceForFee, tickToPrice } from '../../utils'
import { nearestUsableTick } from '@uniswap/v3-sdk'
import RelativeLoading from '../library/RelativeLoading';

// TODO put into utils?
const tickToPriceDisplay = (tick: number) => numDisplay(tickToPrice(tick))

const TickSelector = ({
  tick,
  spacing,
  inverted,
  priceUnit,
  min,
  updateTick,
}: {
  tick: number
  spacing: number
  inverted: boolean
  priceUnit: string
  min: boolean
  updateTick: (newTick: number) => void
}) => {
  return (
    <div>
      {min ? 'Min Price' : 'Max Price'}
      <Button onClick={() => updateTick(inverted ? tick + spacing : tick - spacing)}>-</Button>
      {tickToPriceDisplay(inverted ? -tick : tick)}
      <Button onClick={() => updateTick(inverted ? tick - spacing : tick + spacing)}>+</Button>
      {priceUnit}
    </div>
  )
}

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

  const isDataLoadedRef = useRef(false)

  useEffect(() => {
    if (!isDataLoadedRef.current && nextLowest !== 0 && nextLowest !== null && nextHighest !== null) {
      isDataLoadedRef.current = true

      setLowerTick(nextLowest)
      setUpperTick(nextHighest)
    }
  })

  const toggleInverted = () => setInverted(!inverted)

  const updateLowerTick = (newTick: number) => setLowerTick(tick !== null && newTick < tick ? newTick : lowerTick)
  const updateUpperTick = (newTick: number) => setUpperTick(tick !== null && newTick > tick ? newTick : upperTick)

  const priceUnit = pool === null ? '- per -' :
    (inverted ? pool.token0.symbol : pool.token1.symbol) +
    ' per ' +
    (inverted ? pool.token1.symbol : pool.token0.symbol)

  return (
    <div style={{position: 'relative'}}>
      <RelativeLoading show={poolTicks === null || poolMetadata === null} />
      <Button
        small
        onClick={toggleInverted}
        kind={inverted ? 'secondary' : 'primary'}>
        {pool === null ? '-' : pool.token0.symbol}
      </Button>
      <Button
        small
        onClick={toggleInverted}
        kind={inverted ? 'primary' : 'secondary'}>
        {pool === null ? '-' : pool.token1.symbol}
      </Button>
      {inverted ? price1 : price0} {priceUnit}
      <TickSelector
        tick={inverted ? upperTick : lowerTick}
        updateTick={inverted ? updateUpperTick : updateLowerTick}
        inverted={inverted}
        spacing={spacing}
        priceUnit={priceUnit}
        min
      />
      lower tick: {lowerTick}
      <TickSelector
        tick={inverted ? lowerTick : upperTick}
        updateTick={inverted ? updateLowerTick : updateUpperTick}
        inverted={inverted}
        spacing={spacing}
        priceUnit={priceUnit}
      />
      upper tick: {upperTick}
    </div>
  )
}

export default CreateLiquidityPosition
