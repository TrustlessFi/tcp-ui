import { useHistory } from 'react-router-dom'
import { useEffect } from 'react'
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import waitFor from '../../slices/waitFor'
import {
  sum, roundToXDecimals, getE18PriceForSqrtX96Price, mnt, sqrtBigNumber, bnf,
  numDisplay, unscale
} from '../../utils/'
import SpacedList from '../library/SpacedList'
import Text from '../library/Text'
import LargeText from '../library/LargeText'
import RelativeLoading from '../library/RelativeLoading'
import Center from '../library/Center'
import { Tile, Button } from 'carbon-components-react'
import { resetNonce } from '../../slices/liquidityPage'


const ViewLiquidity = () => {
  const dispatch = useAppDispatch()
  const history = useHistory()

  const {
    liquidityPage,
    poolsCurrentData,
    poolsMetadata,
  } = waitFor([
    'liquidityPage',
    'poolsCurrentData',
    'poolsMetadata',
  ], selector, dispatch)

  useEffect(() => {
    dispatch(resetNonce())
  }, [])

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
      token0: pool.token0,
      token1: pool.token1,
    }
  })

  return (
    <Center style={{marginTop: 40}}>
      <SpacedList row>
        {poolsData.map((pool, index) => {

          const poolPriceE18 = getE18PriceForSqrtX96Price(bnf(poolsCurrentData[pool.address].sqrtPriceX96))
          const userLiquidity = bnf(poolsCurrentData[pool.address].userLiquidityPosition.liquidity)

          const positionToken0Value = userLiquidity.mul(mnt(1)).div(sqrtBigNumber(poolPriceE18.mul(mnt(1))))
          const positionToken1Value = userLiquidity.mul(sqrtBigNumber(poolPriceE18.mul(mnt(1)))).div(mnt(1))

          return (
            <Tile
              key={index}
              style={{width: 300, padding: 30 }}>
              <SpacedList spacing={40}>
                <LargeText>{pool.title} Liquidity</LargeText>
                <Text>{roundToXDecimals(pool.portion * 100, 2)}% of Tcp rewards</Text>
                <Text>
                  Your Position:
                  <p>
                    {numDisplay(unscale(positionToken0Value, pool.token0.decimals))} {pool.token0.displaySymbol}
                  </p>
                  <p>
                    {numDisplay(unscale(positionToken1Value, pool.token1.decimals))} {pool.token1.displaySymbol}
                  </p>
                </Text>
                <SpacedList row spacing={10}>
                  <Button
                    size='sm'
                    onClick={() => history.push(`/liquidity/add/${pool.poolIDString}`)}>
                    Add
                  </Button>
                  <Button
                    size='sm'
                    disabled={bnf(poolsCurrentData[pool.address].userLiquidityPosition.liquidity).isZero()}
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
