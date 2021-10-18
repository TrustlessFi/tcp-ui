import { Button } from 'carbon-components-react'
import { Subtract16, Add16 } from '@carbon/icons-react';
import { useState, useEffect, useRef } from "react"
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import { getPoolCurrentDataWaitFunction, waitForRewards, waitForPoolsMetadata , getContractWaitFunction , getTokenMetadataWaitFunction } from '../../slices/waitFor'
import { poolMetadata } from '../../slices/poolMetadata'
import GenericApprovalButton from '../utils/GenericApprovalButton'
import {
  numDisplay,
  getSpaceForFee,
  tickToPrice,
  getAmount1ForAmount0,
  getAmount0ForAmount1,
  bnf,
  mnt,
  unscale
} from '../../utils'
import { nearestUsableTick } from '@uniswap/v3-sdk'
import PositionNumberInput from '../library/PositionNumberInput'
import RelativeLoading from '../library/RelativeLoading'
import LargeText from '../utils/LargeText'
import Bold from '../utils/Bold'
import { ProtocolContract } from '../../slices/contracts/index';
import { first } from '../../utils/index';

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

const CreateLiquidityPosition = ({ poolAddress, poolMetadata }: { poolAddress: string, poolMetadata: poolMetadata }) => {
  const dispatch = useAppDispatch()

  const derp: (string | null)[] = [null]
  const [derp0] = derp

  const rewardsInfo = waitForRewards(selector, dispatch)
  const poolCurrentDataWaitFunction = getPoolCurrentDataWaitFunction(poolAddress)
  const [poolCurrentData] = poolCurrentDataWaitFunction(selector, dispatch)
  const [token0Metadata, token1Metadata] = getTokenMetadataWaitFunction([poolMetadata.token0, poolMetadata.token1])(selector, dispatch)
  const rewards = getContractWaitFunction(ProtocolContract.Rewards)(selector, dispatch)

  const instantTick = poolCurrentData !== null ? poolCurrentData.instantTick : null
  const tick = poolCurrentData !== null ? poolCurrentData.twapTick : null
  const price0 = tickToPriceDisplay(tick === null ? 0 : tick)
  const price1 = tickToPriceDisplay(tick === null ? 0 : -tick)

  const spacing = getSpaceForFee(poolMetadata === null ? 0 : poolMetadata.fee)
  const nearestTick = nearestUsableTick(tick === null ? 0 : tick, spacing)

  const nextLowest = tick === null ? null : nearestTick < tick ? nearestTick : nearestTick - spacing
  const nextHighest = tick === null ? null : nearestTick > tick ? nearestTick : nearestTick + spacing

  const [inverted, setInverted] = useState(false)
  const [lowerTick, setLowerTick] = useState(0)
  const [upperTick, setUpperTick] = useState(0)
  const [token0Amount, setToken0Amount] = useState(0)
  const [token1Amount, setToken1Amount] = useState(0)
  const [token0AdjustedLast, setToken0AdjustedLast] = useState(true)

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

  const token0Symbol = token0Metadata === null ?  '-' : displaySymbol(token0Metadata.symbol)
  const token1Symbol = pool === null ?  '-' : displaySymbol(pool.token1.symbol)

  const poolName = pool === null ? '-' : token0Symbol + ':' + token1Symbol
  const liquidationPenalty = rewardsInfo === null ? '-' : numDisplay(rewardsInfo.liquidationPenalty * 100)

  const toggleInverted = () => setInverted(!inverted)

  const updateLowerTick = (newTick: number) => {
    if (tick === null || tick <= newTick) return
    setLowerTick(newTick)
    token0AdjustedLast
      ? setToken1Amount(unscale(getAmount1ForAmount0(bnf(mnt(token0Amount)), instantTick!, newTick, upperTick)))
      : setToken0Amount(unscale(getAmount0ForAmount1(bnf(mnt(token1Amount)), instantTick!, newTick, upperTick)))
  }
  const updateUpperTick = (newTick: number) => {
    if (tick === null || tick >= newTick) return
    setUpperTick(newTick)
    token0AdjustedLast
      ? setToken1Amount(unscale(getAmount1ForAmount0(bnf(mnt(token0Amount)), instantTick!, lowerTick, newTick)))
      : setToken0Amount(unscale(getAmount0ForAmount1(bnf(mnt(token1Amount)), instantTick!, lowerTick, newTick)))
  }
  const updateToken0Amount = (amount0: number) => {
    if (isNaN(amount0)) return
    setToken0AdjustedLast(true)
    setToken0Amount(amount0)
    setToken1Amount(unscale(getAmount1ForAmount0(bnf(mnt(amount0)), instantTick!, lowerTick, upperTick)))
  }
  const updateToken1Amount = (amount1: number) => {
    if (isNaN(amount1)) return
    setToken0AdjustedLast(false)
    setToken1Amount(amount1)
    setToken0Amount(unscale(getAmount0ForAmount1(bnf(mnt(amount1)), instantTick!, lowerTick, upperTick)))
  }

  const token0ApprovalButton =
    poolCurrentData === null || rewards === null || pool === null || pool.token0.symbol.toLowerCase() === 'weth'
      ? null
      : (
          <GenericApprovalButton
            token={poolCurrentData.token0.address}
            approvee={rewards}
            approval={poolCurrentData.token0.rewardsApproval}
            tokenSymbol={pool.token0.symbol}
            onApprove={}
          />
        )


  const priceUnit =
    (inverted ? token0Symbol : token1Symbol) +
    ' per ' +
    (inverted ? token1Symbol : token0Symbol)

  return (
    <div style={{position: 'relative'}}>
      <RelativeLoading show={poolCurrentData === null || poolMetadata === null || rewardsInfo === null} />
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
          action={updateToken0Amount}
          value={token0Amount}
        />
        {token0Symbol} and
        <PositionNumberInput
          id="token1Input"
          action={updateToken1Amount}
          value={token1Amount}
        />
        {token1Symbol}.
        <div />
        If the {poolName} price moves outside of this price range, I could lose <Bold>{liquidationPenalty}%</Bold> or
        more of my position to liquidators.
      </LargeText>
    </div>
  )
}

export default CreateLiquidityPosition
