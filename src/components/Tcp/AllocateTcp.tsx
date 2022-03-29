import { useState, useEffect } from "react"
import { useHistory } from 'react-router-dom'
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
  Time32,
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

  const getAmountDisplay = (amount?: number) =>
    amount === undefined
    ? '-'
    : amount === 0
      ? '0'
      : numDisplay(amount, 2)


  const tcpAllocationCount =
    tcpAllocation === null
    ? undefined
    : tcpAllocation.totalAllocation - tcpAllocation.tokensAllocated

  const tcpAllocationDisplay = getAmountDisplay(tcpAllocationCount)

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
      ? getAmountDisplay(tcpAllocationCount)
      : getAmountDisplay(tcpAllocationCount / 2)

  const multiplierDisplay = maxSelected ? '4x' : '2x'

  const lockTimeDisplay = maxSelected ? 4 : 2

  const columnOne =
    <Tile
      style={{width: '100%', padding: 40 }}>
      <SpacedList spacing={40}>
        <LargeText size={28}>Allocate Tcp</LargeText>
        <SpacedList row spacing={5}>
          <Text size={28}>
            {getAmountDisplay(tcpAllocationCount)}
          </Text>
          <Text size={12}>
            Tcp to allocate
          </Text>
        </SpacedList>
        <Toggle
          labelText='Future TDao Income'
          labelA='Minimize'
          labelB='Maximize'
          toggled={maxSelected}
          onToggle={getOnToggle(setMaxSelected)}
          id='toggle'
        />
        <SpacedList spacing={20}>
          <PositionInfoItem
            key='tcp_generating_tdao'
            icon={<ArrowUpRight32 />}
            title='Tcp locked generating TDao'
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
            key='virtual_tcp'
            icon={<Time32 />}
            title='Lock Equivalent'
            value={getAmountDisplay(maxSelected ? (tcpAllocationCount === undefined ? undefined : tcpAllocationCount * 4) : tcpAllocationCount)}
            unit='Tcp'
          />
          <PositionInfoItem
            key='lock_time'
            icon={<Time32 />}
            title='Lock Time'
            value={lockTimeDisplay}
            unit='years'
          />
          <PositionInfoItem
            key='wallet_increase'
            icon={<Wallet32 />}
            title='Wallet increase'
            value={tcpToWalletDisplay}
            unit='Tcp'
          />
        </SpacedList>
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
