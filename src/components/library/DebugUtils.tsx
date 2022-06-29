import { ethers } from 'ethers'
import {
  Modal, Button, Dropdown, OnChangeData,
  NumberInput,
} from 'carbon-components-react'
import { useState } from 'react'
import { onNumChange, seconds, minutes, hours, days, weeks, years }  from '../../utils/'
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import waitFor from '../../slices/waitFor'
import AppTile from '../library/AppTile'
import Text from '../library/Text'
import SpacedList from '../library/SpacedList'
import Center from '../library/Center'

enum TimeOption {
  seconds = 'seconds',
  minutes = 'minutes',
  hours = 'hours',
  days = 'days',
  weeks = 'weeks',
  years = 'years',
}

const debugProvider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545/')

const increaseTime = async (timeIncreaseS: number): Promise<void> => {
  await debugProvider.send("evm_increaseTime", [Math.floor(timeIncreaseS)])
  await debugProvider.send("evm_mine", [])
}

const mineBlocks = async (count = 1): Promise<void> => {
  for(let i = 0; i < count; i++) await debugProvider.send("evm_mine", [])
}

const DebugUtils = () => {
  const dispatch = useAppDispatch()

  const {
    currentChainInfo,
  } = waitFor([
    'currentChainInfo',
  ], selector, dispatch)

  const [ open, setOpen ] = useState(false)
  const [ timeOption, setTimeOption ] = useState<TimeOption>(TimeOption.days)
  const [ timeCount, setTimeCount ] = useState<number>(1)
  const [ blockCount, setBlockCount ] = useState<number>(100)

  const getTimeIncreaseForUnit = (unit: TimeOption) => {
    switch(unit) {
      case TimeOption.seconds:
        return seconds(1)
      case TimeOption.minutes:
        return minutes(1)
      case TimeOption.hours:
        return hours(1)
      case TimeOption.days:
        return days(1)
      case TimeOption.weeks:
        return weeks(1)
      case TimeOption.years:
        return years(1)
    }
  }

  const onIncreaseTimeClicked = async () => {
    const timeIncreaseS = Math.floor(getTimeIncreaseForUnit(timeOption) * timeCount)
    await increaseTime(timeIncreaseS)
  }

  const onMineBlocksClicked = async () => {
    await mineBlocks(blockCount)
  }

  const timestampDisplay =
    currentChainInfo === null
    ? '-'
    : currentChainInfo.blockTimestamp
  const timeDisplay =
    currentChainInfo === null
    ? '-'
    : (new Date(currentChainInfo.blockTimestamp * 1000)).toString()

  const modal =
    <Modal
      open={open}
      passiveModal
      modalHeading="Debug Utils - Only available on hardhat"
      onRequestClose={() => setOpen(false)}>
      <SpacedList spacing={32}>
        <AppTile title='Increase Time'>
          <SpacedList>
            <Text>
              Current Timestamp:
              {' '}
              {timestampDisplay}
            </Text>
            <Text>
              Current Time:
              {' '}
              {timeDisplay}
            </Text>
            <NumberInput
              hideSteppers
              id='number_input'
              min={0}
              step={1}
              onChange={onNumChange((value: number) => setTimeCount(value))}
              value={timeCount}
            />
            <Dropdown
              id="default"
              label="Dropdown menu options"
              initialSelectedItem={timeOption}
              items={Object.values(TimeOption)}
              onChange={(data: OnChangeData<TimeOption>) => {
                const newItem = data.selectedItem
                if (newItem) setTimeOption(newItem)}
              }
            />
            <Center>
              <Button
                kind='secondary'
                onClick={() => onIncreaseTimeClicked()}
                size='sm'>
                Increase Time
              </Button>
            </Center>
          </SpacedList>
        </AppTile>
        <AppTile title='Mine Blocks'>
          <SpacedList>
            <NumberInput
              hideSteppers
              id='number_input'
              min={0}
              step={1}
              onChange={onNumChange((value: number) => setBlockCount(value))}
              value={blockCount}
            />
            <Center>
              <Button
                kind='secondary'
                onClick={() => onMineBlocksClicked()}
                size='sm'>
                Mine Blocks
              </Button>
            </Center>
          </SpacedList>
        </AppTile>
      </SpacedList>
    </Modal>

  return (
    <>
      {modal}
      <Button
        kind='ghost'
        onClick={() => setOpen(!open)}
        size='sm'>
        Debug
      </Button>
    </>
  )
}

export default DebugUtils
