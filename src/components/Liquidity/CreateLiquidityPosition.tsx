import { Button } from 'carbon-components-react'
import { Add16 } from '@carbon/icons-react';
import { useState, useEffect, useRef } from "react"
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import { waitForPoolMetadata, waitForPoolTicks } from '../../slices/waitFor'
import { numDisplay, getSpaceForFee, tickToPrice } from '../../utils'
import { nearestUsableTick } from '@uniswap/v3-sdk'
import RelativeLoading from '../library/RelativeLoading';
import { Row, Col } from 'react-flexbox-grid'

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
    <Row middle="xs" center="xs">
      <Col xs>
        <Button
          small
          hasIconOnly
          kind="secondary"
          renderIcon={Add16}
          onClick={() => updateTick(inverted ? tick + spacing : tick - spacing)}
        />
      </Col>
      <Col xs>
        <Row>
          {min ? 'Min Price' : 'Max Price'}
        </Row>
        <Row>
          {tickToPriceDisplay(inverted ? -tick : tick)}
        </Row>
        <Row>
          {priceUnit}
        </Row>
      </Col>
      <Col xs>
        <Button
          small
          hasIconOnly
          kind="secondary"
          renderIcon={Add16}
          onClick={() => updateTick(inverted ? tick - spacing : tick + spacing)}
        />
      </Col>
    </Row>
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
    if (!isDataLoadedRef.current && tick !== null && nextLowest !== null && nextHighest !== null) {
      isDataLoadedRef.current = true

      setInverted(tick < 0)
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
      <Row top="xs" center="xs">
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
      </Row>
      <Row middle="xs" center="xs">
        <Col xs>
          <TickSelector
            tick={inverted ? upperTick : lowerTick}
            updateTick={inverted ? updateUpperTick : updateLowerTick}
            inverted={inverted}
            spacing={spacing}
            priceUnit={priceUnit}
            min
          />
        </Col>
        <Col xs>
          {inverted ? price1 : price0} {priceUnit}
        </Col>
        <Col xs>
          <TickSelector
            tick={inverted ? lowerTick : upperTick}
            updateTick={inverted ? updateLowerTick : updateUpperTick}
            inverted={inverted}
            spacing={spacing}
            priceUnit={priceUnit}
          />
        </Col>
      </Row>
    </div>
  )
}

export default CreateLiquidityPosition
