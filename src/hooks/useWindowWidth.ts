import { nearestUsableTick } from '@uniswap/v3-sdk'
import { useState, useEffect, useRef } from 'react'
import { getSpaceForFee } from '../utils'
import { poolMetadata } from '../slices/poolsMetadata'

export const SMALL_WINDOW_WIDTH = 800


export default function useWindowWidth(updateHook?: () => void) {

  const [ isSmallViewport, setIsSmallViewport ] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsSmallViewport(window.innerWidth < SMALL_WINDOW_WIDTH)
      if (updateHook !== undefined) updateHook()
    }
    window.addEventListener('resize', handleResize)
    window.addEventListener('load', handleResize)
  })

  return isSmallViewport
}
