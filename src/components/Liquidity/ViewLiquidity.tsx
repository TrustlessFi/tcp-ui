import { useState, useEffect } from "react"
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import waitFor from '../../slices/waitFor'
import { numDisplay } from '../../utils/'
import { years } from '../../utils/'
import OneColumnDisplay from '../library/OneColumnDisplay'
import SpacedList from '../library/SpacedList'
import Text from '../library/Text'
import Bold from '../library/Bold'
import { Tile, Button } from 'carbon-components-react'
import { setStakePage, StakePage } from '../../slices/staking'


const ViewLiquidity = () => {
  const dispatch = useAppDispatch()

  const {
    poolsCurrentData,
    poolsMetadata,
  } = waitFor([
    'poolsCurrentData',
    'poolsMetadata',
  ], selector, dispatch)

  console.log({poolsCurrentData, poolsMetadata})


  return <div>placeholder for view liquidity</div>
}

export default ViewLiquidity
