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
  isZeroish,
} from '../../utils/'
import {
  Tile, Button, Slider, SliderOnChangeArg,
  InlineNotification,
} from 'carbon-components-react'
import { TransactionType, TransactionStatus } from '../../slices/transactions'

interface AddLiquidityParams {
  poolIDString: string
}

const maxSlippage = 0.95

const RemoveLiquidity = () => {
  const dispatch = useAppDispatch()
  const history = useHistory()

  const poolIDString = useParams<AddLiquidityParams>().poolIDString

  const {
    poolsCurrentData,
    poolsMetadata,
    contracts,
  } = waitFor([
    'poolsCurrentData',
    'poolsMetadata',
    'contracts',
  ], selector, dispatch)

  const [sliderValue, setSliderValue] = useState(50)

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
  console.log({poolPriceE18: poolPriceE18.toString(), poolPrice: poolPriceE18.div(mnt(1)).toString()})
  const userLiquidity = poolsCurrentData[pool.address].userLiquidityPosition.liquidity

  console.log({userLiquidity: userLiquidity.toString()})

  const positionToken0Value = userLiquidity.mul(mnt(1)).div(sqrtBigNumber(poolPriceE18.mul(mnt(1))))
  const positionToken1Value = userLiquidity.mul(sqrtBigNumber(poolPriceE18.mul(mnt(1)))).div(mnt(1))

  const token0Count = (unscale(positionToken0Value, pool.token0.decimals) * sliderValue) / 100
  const token1Count = (unscale(positionToken1Value, pool.token1.decimals) * sliderValue) / 100

  const token0IsWeth = pool.token0.symbol.toLowerCase() === 'weth'
  const token1IsWeth = pool.token1.symbol.toLowerCase() === 'weth'

  const successDisplay =
    <Text>
      You will receive at least{' '}
      <Bold>{numDisplay(token0Count * maxSlippage)} {pool.token0.displaySymbol}</Bold>{' '}
      and{' '}
      <Bold>{numDisplay(token1Count * maxSlippage)} {pool.token1.displaySymbol}</Bold>
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
                onChange={(changeData: SliderOnChangeArg) => setSliderValue(changeData.value)}
                value={sliderValue}
                light
              />
            </span>
            <span onClick={() => setSliderValue(100)}>
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
          <SpacedList row spacing={10}>
            <CreateTransactionButton
              disabled={dataNull || contracts === null}
              size='md'
              txArgs={{
                type: TransactionType.AddLiquidity,
                poolID: pool.poolID,
                Rewards: contracts === null ? '' : contracts.Rewards,
                token0: {
                  count: token0Count,
                  decimals: pool.token0.decimals,
                  isWeth: token0IsWeth,
                },
                token1: {
                  count: token1Count,
                  decimals: pool.token1.decimals,
                  isWeth: token1IsWeth,
                }
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
