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
  priceUnit,
  min,
  inverted,
  updateTick,
}: {
  tick: number
  spacing: number
  priceUnit: string
  min: boolean
  inverted: boolean
  updateTick: (newTick: number) => void
}) => {
  return (
    <div>
      {min ? 'Min Price' : 'Max Price'}
      <Button onClick={() => updateTick(tick - spacing)}>-</Button>
      {tickToPriceDisplay(tick)}
      <Button onClick={() => updateTick(tick + spacing)}>+</Button>
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


  const priceUnit = pool === null ? '- per -' :
    (inverted ? pool.token0.symbol : pool.token1.symbol) +
    ' per ' +
    (inverted ? pool.token1.symbol : pool.token0.symbol)

  return (
    <div style={{position: 'relative'}}>
      <RelativeLoading show={poolTicks === null || poolMetadata === null} />
      <Button
        onClick={() => setInverted(true)}
        kind={inverted ? 'secondary' : 'primary'}
        disabled={pool === null}>
        {pool === null ? '-' : pool.token0.symbol}
      </Button>
      <Button
        onClick={() => setInverted(false)}
        kind={inverted ? 'primary' : 'secondary'}
        disabled={pool === null}>
        {pool === null ? '-' : pool.token1.symbol}
      </Button>
      {inverted ? price1 : price0} {priceUnit}
      <TickSelector
        tick={lowerTick}
        spacing={spacing}
        priceUnit={priceUnit}
        updateTick={(newTick: number) => setLowerTick(newTick < upperTick ? newTick : lowerTick)}
        inverted={inverted}
        min
      />
      lower tick: {lowerTick}
      <TickSelector
        tick={upperTick}
        spacing={spacing}
        priceUnit={priceUnit}
        inverted={inverted}
        updateTick={(newTick: number) => setUpperTick(newTick > lowerTick ? newTick : upperTick)}
      />
      upper tick: {upperTick}
    </div>
  )
}

export default CreateLiquidityPosition
