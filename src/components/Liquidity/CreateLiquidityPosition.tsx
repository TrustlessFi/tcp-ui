import { Button } from 'carbon-components-react'
import { useState } from "react"
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import { waitForPoolMetadata, waitForPoolTicks, waitForRewards } from '../../slices/waitFor'
import { getE18PriceForSqrtX96Price, bnf, numDisplay } from '../../utils'
import { unscale } from '@trustlessfi/utils'
import { TickMath } from '@uniswap/v3-sdk'

const CreateLiquidityPosition = ({ poolAddress }: { poolAddress: string }) => {
  const dispatch = useAppDispatch()

  const poolTicks = waitForPoolTicks(selector, dispatch)
  const poolMetadata = waitForPoolMetadata(selector, dispatch)

  const [isToken0Selected, setIsToken0Selected] = useState(true)

  if (poolTicks === null || poolMetadata === null) return <>Loading</>

  const pool = poolMetadata[poolAddress]
  const tick = poolTicks[poolAddress]
  const price0 = numDisplay(unscale(getE18PriceForSqrtX96Price(bnf(TickMath.getSqrtRatioAtTick(tick).toString()))))
  const price1 = numDisplay(unscale(getE18PriceForSqrtX96Price(bnf(TickMath.getSqrtRatioAtTick(-tick).toString()))))

  return (
    <>
      <Button onClick={() => setIsToken0Selected(true)} kind={isToken0Selected ? 'primary' : 'secondary'}>{pool.token0.symbol}</Button>
      <Button onClick={() => setIsToken0Selected(false)} kind={isToken0Selected ? 'secondary' : 'primary'}>{pool.token1.symbol}</Button>
      {[
        isToken0Selected ? price0 : price1,
        isToken0Selected ? pool.token1.symbol : pool.token0.symbol,
        'per',
        isToken0Selected ? pool.token0.symbol : pool.token1.symbol,
      ].join(' ')}
    </>
  )
}

export default CreateLiquidityPosition
