import { useState } from 'react'
import {
  getAmount1ForAmount0,
  getAmount0ForAmount1,
  bnf,
  mnt,
  unscale,
} from '../utils'
import { poolCurrentInfo } from '../slices/poolCurrentData'

export default function useLiquidityPositionUpdates(tickLower: number, setTickLower: Function, tickUpper: number, setTickUpper: Function, poolCurrentData?: poolCurrentInfo | null, tick?: number | null) {
  const [token0AdjustedLast, setToken0AdjustedLast] = useState(true)
  const [token0Amount, setToken0Amount] = useState(0)
  const [token1Amount, setToken1Amount] = useState(0)
  const instantTick = poolCurrentData ? poolCurrentData.instantTick : null

  const updateLowerTick = (newTick: number) => {
    if (typeof tick !== 'number' || tick <= newTick) return
    setTickLower(newTick)
    token0AdjustedLast
      ? setToken1Amount(unscale(getAmount1ForAmount0(bnf(mnt(token0Amount)), instantTick!, newTick, tickUpper)))
      : setToken0Amount(unscale(getAmount0ForAmount1(bnf(mnt(token1Amount)), instantTick!, newTick, tickUpper)))
  }
  const updateUpperTick = (newTick: number) => {
    if (typeof tick !== 'number' || tick >= newTick) return
    setTickUpper(newTick)
    token0AdjustedLast
      ? setToken1Amount(unscale(getAmount1ForAmount0(bnf(mnt(token0Amount)), instantTick!, tickLower, newTick)))
      : setToken0Amount(unscale(getAmount0ForAmount1(bnf(mnt(token1Amount)), instantTick!, tickLower, newTick)))
  }
  const updateToken0Amount = (amount0: number) => {
    if (isNaN(amount0)) return
    setToken0AdjustedLast(true)
    setToken0Amount(amount0)
    setToken1Amount(unscale(getAmount1ForAmount0(bnf(mnt(amount0)), instantTick!, tickLower, tickUpper)))
  }
  const updateToken1Amount = (amount1: number) => {
    if (isNaN(amount1)) return
    setToken0AdjustedLast(false)
    setToken1Amount(amount1)
    setToken0Amount(unscale(getAmount0ForAmount1(bnf(mnt(amount1)), instantTick!, tickLower, tickUpper)))
  }

  return {
      token0Amount, setToken0Amount,
      token1Amount, setToken1Amount,
      updateLowerTick,
      updateUpperTick,
      updateToken0Amount,
      updateToken1Amount
  }
}