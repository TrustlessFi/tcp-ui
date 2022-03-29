import { useHistory } from 'react-router-dom'
import { useEffect } from 'react'
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import waitFor from '../../slices/waitFor'
import {
  numDisplay, unscale, isZeroish
} from '../../utils/'
import SpacedList from '../library/SpacedList'
import Text from '../library/Text'
import LargeText from '../library/LargeText'
import OneColumnDisplay from '../library/OneColumnDisplay'
import { Tile, Button } from 'carbon-components-react'
import { resetNonce } from '../../slices/liquidityPage'
import ProtocolContract from '../../slices/contracts/ProtocolContract'

const ViewTcp = () => {
  const dispatch = useAppDispatch()
  const history = useHistory()

  const {
    balances,
    contracts,
    tcpAllocation,
  } = waitFor([
    'balances',
    'contracts',
    'tcpAllocation',
  ], selector, dispatch)

  useEffect(() => {
    dispatch(resetNonce())
  }, [])

  const tcpBalanceDisplay =
    contracts === null || balances === null
      ? '-'
      : numDisplay(balances.tokens[contracts[ProtocolContract.Tcp]].userBalance, 2)

  const tcpAllocationCount =
    tcpAllocation === null
    ? undefined
    : tcpAllocation.totalAllocation - tcpAllocation.tokensAllocated

  const tcpAllocationDisplay =
    tcpAllocationCount === undefined
    ? '-'
    : numDisplay(tcpAllocationCount, 2)

  const columnOne =
    <Tile
      style={{width: '100%', padding: 40 }}>
      <SpacedList spacing={40}>
        <LargeText size={28}>Allocate Tcp</LargeText>
        <SpacedList spacing={5}>
          <LargeText>Tcp Balance</LargeText>
          <Text size={12}>{tcpBalanceDisplay}</Text>
        </SpacedList>
        <SpacedList spacing={5}>
          <LargeText>Tcp To Allocate</LargeText>
          <Text size={12}>{tcpAllocationDisplay}</Text>
        </SpacedList>
        <SpacedList row spacing={20}>
          <Button
            size='md'
            disabled={isZeroish(tcpAllocationCount)}
            onClick={() => history.push(`/tcp/allocate/`)}>
            Allocate Tcp
          </Button>
        </SpacedList>
      </SpacedList>
    </Tile>

  return <OneColumnDisplay columnOne={columnOne} innerStyle={{marginTop: 40}} />
}

export default ViewTcp
