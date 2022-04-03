import { useState, useEffect } from "react"
import { useHistory } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import { Row } from 'react-flexbox-grid'
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import waitFor from '../../slices/waitFor'
import SpacedList from '../library/SpacedList'
import CreateTransactionButton from '../library/CreateTransactionButton'
import Text from '../library/Text'
import LargeText from '../library/LargeText'
import Bold from '../library/Bold'
import RelativeLoading from '../library/RelativeLoading'
import Center from '../library/Center'
import {
  getE18PriceForSqrtX96Price, bnf, unscale, sqrtBigNumber, mnt, numDisplay,
  timeToPeriod, hours,
} from '../../utils/'
import { SLIPPAGE_TOLERANCE_BIPS } from '../../constants'
import {
  Tile, Button, Slider, SliderOnChangeArg,
  InlineNotification,
} from 'carbon-components-react'
import { TransactionType } from '../../slices/transactions'

interface AddLiquidityParams {
  poolIDString: string
}

const slippageMultiplier = (1e4 - SLIPPAGE_TOLERANCE_BIPS) / 1e4

const RemoveLiquidity = () => {
  const dispatch = useAppDispatch()
  const history = useHistory()

  const poolIDString = useParams<AddLiquidityParams>().poolIDString

  const {
    liquidityPage,
    poolsCurrentData,
    poolsMetadata,
    contracts,
    currentChainInfo,
    rewardsInfo,
  } = waitFor([
    'liquidityPage',
    'poolsCurrentData',
    'poolsMetadata',
    'contracts',
    'currentChainInfo',
    'rewardsInfo',
  ], selector, dispatch)

  const [liquidityPercentage, setLiquidityPercentage] = useState(50)

  const updateLiquidityPercentage = (value: number) => {
    if (value < 0) value = 0
    if (value > 100) value = 100
    setLiquidityPercentage(value)
  }

  const dataNull =
    poolsCurrentData === null ||
    poolsMetadata === null ||
    currentChainInfo === null ||
    rewardsInfo === null

  const matchingPools =
    poolsMetadata === null
    ? []
    : Object.entries(poolsMetadata).map(([address, pool]) => ({
        ...pool,
        address,
      })).filter(pool => pool.poolIDString === poolIDString)

  useEffect(() => {
    if (poolsMetadata !== null && matchingPools.length === 0) {
      history.push('/liquidity')
    }
  }, [matchingPools])

  useEffect(() => {
    if (liquidityPage.liquidityPageNonce !== 0) {
      history.push('/liquidity')
    }
  }, [liquidityPage.liquidityPageNonce])

  if (dataNull || matchingPools.length === 0 ) {
    return (
      <Center style={{ position: 'relative', marginTop: 40 }}>
        <RelativeLoading show={true} />
        <Tile style={{width: 200, height: 200}} />
      </Center>
    )
  }

  const pool = matchingPools[0]
  const poolPriceE18 = getE18PriceForSqrtX96Price(bnf(poolsCurrentData[pool.address].sqrtPriceX96))
  const userLiquidity = bnf(poolsCurrentData[pool.address].userLiquidityPosition.liquidity)

  const currentRewardsPeriod = timeToPeriod(
    currentChainInfo.blockTimestamp,
    rewardsInfo.periodLength,
    rewardsInfo.firstPeriod,
  )

  const currentRewardsDecreasePeriod = Math.floor(currentRewardsPeriod / (hours(1) / rewardsInfo.periodLength))

  const minLiquidity =
    poolsCurrentData[pool.address].minLiquidityByPeriod.period < currentRewardsDecreasePeriod
    ? bnf(poolsCurrentData[pool.address].poolLiquidity).mul(bnf(mnt(1)).sub(mnt(rewardsInfo.maxCollateralLiquidityDecreasePerPeriod))).div(mnt(1))
    : poolsCurrentData[pool.address].minLiquidityByPeriod.minLiquidity

  const liquidityDelta =
    bnf(poolsCurrentData[pool.address].poolLiquidity)
      .sub(minLiquidity)

  const maxLiquidityDecrease = liquidityDelta.gt(0) ? liquidityDelta : bnf(0)

  const maxPercentageDecrease =
    maxLiquidityDecrease.isZero()
    ? 0
    : unscale(maxLiquidityDecrease.mul(100).mul(mnt(1)).div(userLiquidity))

  const maxPercentageDecreaseExceeded = liquidityPercentage > maxPercentageDecrease

  const positionToken0Value = userLiquidity.mul(mnt(1)).div(sqrtBigNumber(poolPriceE18.mul(mnt(1))))
  const positionToken1Value = userLiquidity.mul(sqrtBigNumber(poolPriceE18.mul(mnt(1)))).div(mnt(1))

  const token0Count = (unscale(positionToken0Value, pool.token0.decimals) * liquidityPercentage) / 100
  const token1Count = (unscale(positionToken1Value, pool.token1.decimals) * liquidityPercentage) / 100

  const successDisplay =
    <Text>
      You will receive at least{' '}
      <Bold>{numDisplay(token0Count * slippageMultiplier)} {pool.token0.displaySymbol}</Bold>{' '}
      and{' '}
      <Bold>{numDisplay(token1Count * slippageMultiplier)} {pool.token1.displaySymbol}</Bold>
      .
    </Text>

  return (
    <Center style={{marginTop: 40}}>
      <Tile style={{width: 500, padding: 40}}>
        <SpacedList spacing={40}>
          <LargeText size={28}>Remove {pool.title} Liquidity</LargeText>
          <Row middle='xs'>
            <Text>Percentage to withdraw</Text>
            <span style={{width: 364, display: 'inline-block'}}>
              <Slider
                light
                ariaLabelInput="Label for slider value"
                id='slider'
                minLabel='%'
                maxLabel='%'
                min={0}
                max={100}
                step={5}
                value={liquidityPercentage}
                onChange={(changeData: SliderOnChangeArg) => updateLiquidityPercentage(changeData.value)}
                invalid={userLiquidity.isZero() || maxPercentageDecreaseExceeded}
                disabled={userLiquidity.isZero()}
              />
            </span>
            <span onClick={() => setLiquidityPercentage(100)}>
              <Text
                size={12}
                style={{
                  cursor: 'pointer',
                  color: '#ffffff',
                  opacity: 0.6,
                  textDecoration: 'underline',
                  marginLeft: 20,
                }}>
                Max
              </Text>
            </span>
          </Row>
          {
            userLiquidity.isZero()
            ? <InlineNotification
                notificationType='inline'
                kind='error'
                title='You have no liquidity to remove.'
                lowContrast
                hideCloseButton
              />
            : maxPercentageDecreaseExceeded
              ? <InlineNotification
                  notificationType='inline'
                  kind='error'
                  title='Removing this much liquidity would destabilize the protocol.'
                  lowContrast
                  hideCloseButton
                />
              : liquidityPercentage === 0
                ? <InlineNotification
                    notificationType='inline'
                    kind='error'
                    title='Please remove some liquidity.'
                    lowContrast
                    hideCloseButton
                  />
                : <InlineNotification
                    key='success_indicator'
                    notificationType='inline'
                    kind='success'
                    title={successDisplay}
                    lowContrast
                    hideCloseButton
                  />
          }
          <SpacedList row spacing={20}>
            <CreateTransactionButton
              disabled={
                dataNull ||
                contracts === null ||
                userLiquidity.isZero() ||
                liquidityPercentage === 0 ||
                maxPercentageDecreaseExceeded
              }
              size='md'
              txArgs={{
                type: TransactionType.RemoveLiquidity,
                poolID: pool.poolID,
                Rewards: contracts === null ? '' : contracts.Rewards,
                liquidity: userLiquidity.mul(liquidityPercentage).div(100).toString(),
                amount0Min:
                  positionToken0Value
                    .mul(liquidityPercentage)
                    .mul(1e4 - SLIPPAGE_TOLERANCE_BIPS)
                    .div(100)
                    .div(1e4)
                    .toString(),
                amount1Min:
                  positionToken1Value
                    .mul(liquidityPercentage)
                    .mul(1e4 - SLIPPAGE_TOLERANCE_BIPS)
                    .div(100)
                    .div(1e4)
                    .toString(),
                liquidityPercentage,
                poolName: pool.title,
              }}
            />
            <Button
              size='md'
              kind='secondary'
              onClick={() => history.push('/liquidity')}>
              Cancel
            </Button>
          </SpacedList>
        </SpacedList>
      </Tile>
    </Center>
  )
}

export default RemoveLiquidity
