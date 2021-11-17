import { nearestUsableTick } from '@uniswap/v3-sdk'
import { useState, useEffect, useRef } from 'react'
import { getSpaceForFee } from '../utils'
import { poolMetadata } from '../slices/poolsMetadata'

export default function usePoolDisplayInfo (pool?: poolMetadata | null, tick?: number | null) {
  const spacing = getSpaceForFee(!pool ? 0 : pool.fee)
  const nearestTick = nearestUsableTick(!tick ? 0 : tick, spacing)
  const nextLowest = typeof tick !== 'number' ? null : nearestTick < tick ? nearestTick : nearestTick - spacing
  const nextHighest = typeof tick !== 'number' ? null : nearestTick > tick ? nearestTick : nearestTick + spacing

  const [inverted, setInverted] = useState(false)
  const [tickLower, setTickLower] = useState(0)
  const [tickUpper, setTickUpper] = useState(0)

  const isDataLoadedRef = useRef(false)

  useEffect(() => {
      if (!isDataLoadedRef.current && typeof tick === 'number' && nextLowest !== null && nextHighest !== null) {
        isDataLoadedRef.current = true

        setInverted(tick < 0)
        setTickLower(nextLowest)
        setTickUpper(nextHighest)
      }
  }, [tick, nextLowest, nextHighest])

  return {
      inverted, setInverted,
      tickLower, setTickLower,
      tickUpper, setTickUpper
  }
}