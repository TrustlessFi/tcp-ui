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
import OneColumnDisplay from '../library/OneColumnDisplay'
import RelativeLoading from '../library/RelativeLoading'
import Center from '../library/Center'
import {
  getE18PriceForSqrtX96Price, bnf, unscale, sqrtBigNumber, mnt, numDisplay,
  timeToPeriod, hours, isZeroish
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

const AllocateTcp = () => {
  const dispatch = useAppDispatch()
  const history = useHistory()

  const poolIDString = useParams<AddLiquidityParams>().poolIDString

  const {
    tcpAllocation,
  } = waitFor([
    'tcpAllocation',
  ], selector, dispatch)

  const [liquidityPercentage, setLiquidityPercentage] = useState(50)

  const tcpAllocationCount =
    tcpAllocation === null
    ? undefined
    : tcpAllocation.totalAllocation - tcpAllocation.tokensAllocated

  const columnOne =
    <Tile
      style={{width: '100%', padding: 40 }}>
      <SpacedList spacing={40}>
        <LargeText size={28}>Allocate Tcp</LargeText>
        <Row middle='xs'>
          <Text>Percentage to withdraw</Text>
          <span style={{width: 364, display: 'inline-block'}}>
            <Slider
              ariaLabelInput="Label for slider value"
              id='slider'
              min={0}
              minLabel='%'
              disabled={isZeroish(tcpAllocationCount)}
              maxLabel='%'
              max={100}
              step={5}
              invalid={false}
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
        <SpacedList row spacing={20}>
          <Button
            size='md'
            onClick={() => alert('allocate clicked')}>
            Allocate Tcp
          </Button>
          <Button
            size='md'
            kind='secondary'
            onClick={() => history.push('/tcp')}>
            Cancel
          </Button>
        </SpacedList>
      </SpacedList>
    </Tile>

  return (
    <OneColumnDisplay columnOne={columnOne} innerStyle={{marginTop: 40}} />
  )
}

export default AllocateTcp
