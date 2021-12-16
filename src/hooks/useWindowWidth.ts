import { useState, useEffect } from 'react'

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
