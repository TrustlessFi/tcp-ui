import { useState, useEffect } from "react"
import { useHistory } from 'react-router-dom'
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import waitFor from '../../slices/waitFor'
import { sum, roundToXDecimals } from '../../utils/'
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
    console.log({pool, totalRewardsPortion})
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
              style={{width: 300, height: 200}}>
              <SpacedList spacing={40}>
                <LargeText>{pool.title}</LargeText>
                <Text>{roundToXDecimals(pool.portion * 100, 2)}% of Tcp rewards</Text>
                <SpacedList row spacing={10}>
                  <Button
                    size='sm'
                    onClick={() => history.push(`/liquidity/add/${pool.poolIDString}`)}>
                    Add
                  </Button>
                  <Button
                    size='sm'
                    onClick={() => history.push(`/liquidity/remove/${pool.poolIDString}`)}>
                    Remove
                  </Button>
                </SpacedList>
              </SpacedList>
            </Tile>
          )
        })}
      </SpacedList>
    </Center>
  )
}

export default ViewLiquidity
