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
import TitleText from '../library/TitleText'
import OneColumnDisplay from '../library/OneColumnDisplay'
import ClaimRewardsButton from '../library/ClaimRewardsButton'
import { Tile, Button } from 'carbon-components-react'
import { resetNonce } from '../../slices/liquidityPage'
import { TransactionType } from '../../slices/transactions'
import { WalletToken } from '../library/TrustlessLogos'

const ViewLiquidity = () => {
  const dispatch = useAppDispatch()
  const history = useHistory()

  const {
    poolsCurrentData,
    poolsMetadata,
    contracts,
  } = waitFor([
    'poolsCurrentData',
    'poolsMetadata',
    'contracts',
  ], selector, dispatch)

  useEffect(() => {
    dispatch(resetNonce())
  }, [])

  const dataNull =
    poolsCurrentData === null ||
    poolsMetadata === null ||
    contracts === null

  if (dataNull) {
    return (
      <OneColumnDisplay innerStyle={{marginTop: 40}} loading={true}>
        <Tile style={{width: '100%', height: 200}} />
      </OneColumnDisplay>
    )
  }
  const totalRewardsPortion = Object.values(poolsMetadata).map(md => md.rewardsPortion).reduce(sum)

  const poolsData = Object.entries(poolsMetadata).map(([address, pool]) => {
    return {
      portion: pool.rewardsPortion / totalRewardsPortion,
      title: pool.title,
      address: address,
      poolIDString: pool.poolIDString,
      token0: pool.token0,
      token1: pool.token1,
    }
  })

  let totalApproximateRewards = 0
  let poolIDsWithRewards: number[] = []

  Object.values(poolsCurrentData).map(pool => {
    const approximateRewards = pool.userLiquidityPosition.approximateRewards
    if (approximateRewards > 0) poolIDsWithRewards.push(pool.poolID)
    totalApproximateRewards += approximateRewards
  })

  return (
    <OneColumnDisplay loading={poolsCurrentData === null || poolsMetadata === null}>
      <SpacedList row>
        {poolsData.map((pool, index) => {

          const poolPriceE18 = getE18PriceForSqrtX96Price(bnf(poolsCurrentData[pool.address].sqrtPriceX96))
          const userLiquidity = bnf(poolsCurrentData[pool.address].userLiquidityPosition.liquidity)

          const positionToken0Value = userLiquidity.mul(mnt(1)).div(sqrtBigNumber(poolPriceE18.mul(mnt(1))))
          const positionToken1Value = userLiquidity.mul(sqrtBigNumber(poolPriceE18.mul(mnt(1)))).div(mnt(1))

          return (
            <Tile
              key={index}
              style={{width: '100%', padding: 40 }}>
              <SpacedList spacing={40}>
                <SpacedList spacing={10}>
                  <LargeText size={28}>{pool.title} Liquidity</LargeText>
                  <Text>{roundToXDecimals(pool.portion * 100, 2)}% of Tcp rewards</Text>
                </SpacedList>
                <SpacedList spacing={10}>
                  <LargeText>
                    Your Position:
                  </LargeText>
                  <SpacedList row spacing={5}>
                    <TitleText>
                    {numDisplay(unscale(positionToken0Value, pool.token0.decimals))}
                    </TitleText>
                    <Text>
                      {pool.token0.displaySymbol}
                    </Text>
                  </SpacedList>
                  <SpacedList row spacing={5}>
                    <TitleText>
                      {numDisplay(unscale(positionToken1Value, pool.token1.decimals))}
                    </TitleText>
                    <Text>
                      {pool.token1.displaySymbol}
                    </Text>
                  </SpacedList>
                </SpacedList>
                <SpacedList row spacing={20}>
                  <Button
                    size='md'
                    onClick={() => history.push(`/liquidity/add/${pool.poolIDString}`)}>
                    Add
                  </Button>
                  <Button
                    size='md'
                    kind='secondary'
                    disabled={bnf(poolsCurrentData[pool.address].userLiquidityPosition.liquidity).isZero()}
                    onClick={() => history.push(`/liquidity/remove/${pool.poolIDString}`)}>
                    Remove
                  </Button>
                </SpacedList>
              </SpacedList>
            </Tile>
          )
        })}
        <ClaimRewardsButton
          txArgs={{
            type: TransactionType.ClaimAllLiquidityPositionRewards,
            poolIDs: poolIDsWithRewards,
            Rewards: contracts.Rewards,
          }}
          count={totalApproximateRewards}
          disabled={false}
          walletToken={WalletToken.Tcp}
        />
      </SpacedList>
    </OneColumnDisplay>
  )
}

export default ViewLiquidity
