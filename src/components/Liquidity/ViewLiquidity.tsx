import { useState, useEffect } from "react"
import { useHistory } from 'react-router-dom'
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import waitFor from '../../slices/waitFor'
import { sum } from '../../utils/'
import OneColumnDisplay from '../library/OneColumnDisplay'
import SpacedList from '../library/SpacedList'
import Text from '../library/Text'
import LargeText from '../library/LargeText'
import Bold from '../library/Bold'
import RelativeLoading from '../library/RelativeLoading'
import Center from '../library/Center'
import { Tile, Button } from 'carbon-components-react'
import { setStakePage, StakePage } from '../../slices/staking'
import { LiquidityPage, setLiquidityPage, setCurrentPool } from '../../slices/liquidityPage'


const ViewLiquidity = () => {
  const dispatch = useAppDispatch()
  const history = useHistory()

  const {
    poolsCurrentData,
    poolsMetadata,
  } = waitFor([
    'poolsCurrentData', // TODO remove?
    'poolsMetadata',
  ], selector, dispatch)

  const dataNull =
    poolsCurrentData === null
    || poolsMetadata === null

  if (dataNull) {
    return (
      <Center style={{ position: 'relative', marginTop: 40 }}>
        <RelativeLoading show={true} />
        <Tile style={{width: 200, height: 200}} />
      </Center>
    )
  }
  const totalRewardsPortion = Object.values(poolsMetadata).map(md => md.rewardsPortion).reduce(sum)

  const poolsData = Object.entries(poolsMetadata).map(([address, pool]) => {
    return {
      portion: pool.rewardsPortion / totalRewardsPortion,
      title: pool.title,
      address: address,
      poolIDString: pool.poolIDString,
    }
  })

  return (
    <Center style={{marginTop: 40}}>
      <SpacedList row>
        {poolsData.map((pool, index) => {
          return (
            <Tile
              key={index}
              style={{width: 200, height: 200}}
              onClick={() => history.push(`/liquidity/add/${pool.poolIDString}`)}>
              <SpacedList spacing={20}>
                <LargeText>{pool.title}</LargeText>
                <Text>{pool.portion}% of Tcp rewards</Text>
              </SpacedList>
            </Tile>
          )
        })}
      </SpacedList>
    </Center>
  )
}

export default ViewLiquidity
