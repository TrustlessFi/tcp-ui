import { useState, useEffect } from "react"
import { useHistory } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import waitFor from '../../slices/waitFor'
import { sum, roundToXDecimals } from '../../utils/'
import OneColumnDisplay from '../library/OneColumnDisplay'
import SpacedList from '../library/SpacedList'
import Text from '../library/Text'
import LargeText from '../library/LargeText'
import Bold from '../library/Bold'
import RelativeLoading from '../library/RelativeLoading'
import FullNumberInput from '../library/FullNumberInput'
import Center from '../library/Center'
import { Tile, Button } from 'carbon-components-react'
import { setStakePage, StakePage } from '../../slices/staking'
import { LiquidityPage, setLiquidityPage, setCurrentPool } from '../../slices/liquidityPage'

interface AddLiquidityParams {
  poolIDString: string
}

const AddLiquidity = () => {
  const dispatch = useAppDispatch()
  const history = useHistory()

  const poolIDString = useParams<AddLiquidityParams>().poolIDString

  const [token0Count, setToken0Count] = useState(0)
  const [token1Count, setToken1Count] = useState(0)
  const [isToken0Focused, setIsToken0Focused] = useState(false)
  const [isToken1Focused, setIsToken1Focused] = useState(false)

  const {
    poolsCurrentData,
    poolsMetadata,
    balances,
  } = waitFor([
    'poolsCurrentData', // TODO remove?
    'poolsMetadata',
    'balances',
  ], selector, dispatch)
  console.log("here 1")

  const dataNull =
    poolsCurrentData === null ||
    poolsMetadata === null

    console.log({poolIDString})

  const matchingPools =
    poolsMetadata === null
    ? []
    : Object.entries(poolsMetadata).map(([address, pool]) => ({
        ...pool,
        address,
      })).filter(pool => pool.poolIDString === poolIDString)

  useEffect(() => {
    if (!poolsMetadata !== null && matchingPools.length === 0) {
      history.push('/liquidity')
    }
  }, [matchingPools])

  if (matchingPools.length === 0 || dataNull) {
    return (
      <Center style={{ position: 'relative', marginTop: 40 }}>
        <RelativeLoading show={true} />
        <Tile style={{width: 200, height: 200}} />
      </Center>
    )
  }

  const pool = matchingPools[0]
  const token0IsWeth = pool.token0.symbol.toLowerCase() === 'weth'
  const token1IsWeth = pool.token1.symbol.toLowerCase() === 'weth'

  const token0UserBalance =
    balances === null
    ? '-'
    : (token0IsWeth
      ? roundToXDecimals(balances.userEthBalance, 4, true)
      : roundToXDecimals(balances.tokens[pool.token0.address].userBalance, 2, true))

  const token1UserBalance =
    balances === null
    ? '-'
    : (token1IsWeth
      ? roundToXDecimals(balances.userEthBalance, 4, true)
      : roundToXDecimals(balances.tokens[pool.token1.address].userBalance, 2, true))


  return (
    <Center style={{marginTop: 40}}>
      <Tile style={{width: 500, padding: 40}}>
        <SpacedList spacing={40}>
          <LargeText>{pool.title}</LargeText>
          <Center>
            <Button size='sm'>Add</Button>
            <Button
              size='sm'
              kind='secondary'
              onClick={() => history.push(`/liquidity/remove/${poolIDString}`)}>
              Remove
            </Button>
          </Center>
          <FullNumberInput
            title={pool.token0.symbol}
            action={setToken0Count}
            value={0}
            unit={pool.token0.symbol}
            light
            frozen={false}
            defaultButton={{
              title: 'Max',
              action: () => alert('default button clicked'),
            }}
            onFocusUpdate={setIsToken0Focused}
            subTitle={
              <Text>
                You have
                {' '}
                <Bold>
                  {token0UserBalance}
                </Bold>
                {' '}
                {pool.token0.symbol} in your wallet
              </Text>
            }
          />
          <FullNumberInput
            title={pool.token1.symbol}
            action={setToken1Count}
            value={0}
            unit={pool.token1.symbol}
            light
            frozen={false}
            defaultButton={{
              title: 'Max',
              action: () => alert('default button clicked'),
            }}
            onFocusUpdate={setIsToken0Focused}
            subTitle={
              <Text>
                You have
                {' '}
                <Bold>
                  {token1UserBalance}
                </Bold>
                {' '}
                {pool.token1.symbol} in your wallet
              </Text>
            }
          />
          <SpacedList row spacing={10}>
            <Button size='md'>
              Add Liquidity
            </Button>
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

export default AddLiquidity
