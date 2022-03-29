import { useState, useEffect } from "react"
import { useHistory } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import { Row } from 'react-flexbox-grid'
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import waitFor from '../../slices/waitFor'
import SpacedList from '../library/SpacedList'
import Text from '../library/Text'
import LargeText from '../library/LargeText'
import PositionInfoItem from '../library/PositionInfoItem'
import OneColumnDisplay from '../library/OneColumnDisplay'
import {
  isZeroish, getOnToggle, numDisplay,
} from '../../utils/'
import {
  Tile, Button, Slider, SliderOnChangeArg, Switch, Toggle,
} from 'carbon-components-react'
import {
  ArrowUpRight32,
  Crossroads32,
  Wallet32,
} from '@carbon/icons-react';

const AllocateTcp = () => {
  const dispatch = useAppDispatch()
  const history = useHistory()

  const {
    tcpAllocation,
  } = waitFor([
    'tcpAllocation',
  ], selector, dispatch)

  const [maxSelected, setMaxSelected] = useState(true)

  const tcpAllocationCount =
    tcpAllocation === null
    ? undefined
    : tcpAllocation.totalAllocation - tcpAllocation.tokensAllocated

  const tcpAllocationDisplay =
    tcpAllocationCount === undefined
    ? '-'
    : numDisplay(tcpAllocationCount, 2)

  const tcpToWalletDisplay =
    maxSelected ||
    tcpAllocationCount === undefined ||
    tcpAllocationCount === 0
    ? '0'
    : numDisplay(tcpAllocationCount / 2, 2)

  const tcpGeneratingTDaoDisplay =
    tcpAllocationCount === undefined
    ? '-'
    : maxSelected
      ? tcpAllocationCount === 0
        ? '0'
        : numDisplay(tcpAllocationCount, 2)
      : tcpAllocationCount === 0
        ? '0'
        : numDisplay(tcpAllocationCount / 2, 2)

  const multiplierDisplay = maxSelected ? '4x' : '2x'

  const columnOne =
    <Tile
      style={{width: '100%', padding: 40 }}>
      <SpacedList spacing={40}>
        <LargeText size={28}>Allocate Tcp</LargeText>
        <SpacedList spacing={5}>
          <LargeText>Tcp To Allocate</LargeText>
          <Text size={12}>{tcpAllocationDisplay}</Text>
        </SpacedList>
        <Toggle
          labelText='Future TDao Income'
          labelA='Minimize'
          labelB='Maximize'
          toggled={maxSelected}
          onToggle={getOnToggle(setMaxSelected)}
          id='toggle'
        />
        <PositionInfoItem
          key='tcp_generating_tdao'
          icon={<ArrowUpRight32 />}
          title='Tcp generating TDao'
          value={tcpGeneratingTDaoDisplay}
          unit='Tcp'
        />
        <PositionInfoItem
          key='multiplier'
          icon={<Crossroads32 />}
          title='Multiplier'
          value={multiplierDisplay}
        />
        <PositionInfoItem
          key='wallet_increase'
          icon={<Wallet32 />}
          title='Wallet increase'
          value={tcpToWalletDisplay}
          unit='Tcp'
        />
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
