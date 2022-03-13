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
  } = waitFor([
    'liquidityPage',
    'poolsCurrentData',
    'poolsMetadata',
    'contracts',
  ], selector, dispatch)

  const [liquidityPercentage, setLiquidityPercentage] = useState(50)

  const dataNull =
    poolsCurrentData === null ||
    poolsMetadata === null

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
          <LargeText>Remove {pool.title} Liquidity</LargeText>
          <Row middle='xs'>
            <Text>Percentage to withdraw</Text>
            <span style={{width: 364, display: 'inline-block'}}>
              <Slider
                ariaLabelInput="Label for slider value"
                id='slider'
                min={0}
                minLabel='%'
                disabled={userLiquidity.isZero()}
                maxLabel='%'
                max={100}
                step={5}
                invalid={userLiquidity.isZero()}
                onChange={(changeData: SliderOnChangeArg) => setLiquidityPercentage(changeData.value)}
                value={liquidityPercentage}
                light
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
              disabled={dataNull || contracts === null || userLiquidity.isZero()}
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
