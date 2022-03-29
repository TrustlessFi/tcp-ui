import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import {
  Modal, Button, NumberInput, Tile,
} from 'carbon-components-react'
import { TransactionType } from '../../slices/transactions'
import { useState } from 'react'
import { onNumChange, days }  from '../../utils/'
import SpacedList from '../library/SpacedList'
import CreateTransactionButton from '../library/CreateTransactionButton'
import Text from '../library/Text'
import waitFor from '../../slices/waitFor'

const GuardianModal = () => {
  const dispatch = useAppDispatch()

  const [ open, setOpen ] = useState(false)

  const [ startTime, setStartTime ] = useState(0)

  const {
    contracts,
    rootContracts,
    tcpTimelock,
    userAddress,
    currentChainInfo,
    governorInfo,
  } = waitFor([
    'contracts',
    'rootContracts',
    'tcpTimelock',
    'userAddress',
    'currentChainInfo',
    'governorInfo',
  ], selector, dispatch)

  const dataNull =
    contracts === null ||
    rootContracts === null ||
    tcpTimelock === null ||
    userAddress === null ||
    currentChainInfo === null ||
    governorInfo === null

  if (dataNull || tcpTimelock.guardian !== userAddress) return <></>

  const modal =
    <Modal
      passiveModal
      hasScrollingContent
      preventCloseOnClickOutside
      open={open}
      modalAriaLabel="tokens modal"
      onRequestClose={() => setOpen(false)}
      secondaryButtonText='Cancel'>
      <SpacedList spacing={32}>
        <Tile>
          <SpacedList spacing={40}>
            <Text>
              Current Phase:
              {' '}
              {governorInfo.phase}
            </Text>
            <Text>
              Current chain timestamp:
              {' '}
              {currentChainInfo.blockTimestamp}
            </Text>
            <Text>
              Suggested start time:
              {' '}
              {currentChainInfo.blockTimestamp + days(1)}
            </Text>
            <NumberInput
              hideSteppers
              id='start_time'
              label="Phase 1 Start Time"
              min={0}
              step={1}
              onChange={onNumChange((value: number) => setStartTime(value))}
              value={startTime}
            />
            <CreateTransactionButton
              title='Confirm'
              key='set_phase_1_start_time'
              disabled={startTime === 0 || governorInfo.phase === 1}
              size='md'
              txArgs={{
                type: TransactionType.SetPhaseOneStartTime,
                startTime,
                Governor: rootContracts === null ? '' : rootContracts.governor,
              }}
            />
          </SpacedList>
        </Tile>
      </SpacedList>
    </Modal>

  return (
    <>
      {modal}
      <Button
        kind='ghost'
        onClick={() => setOpen(!open)}
        size='sm'>
        Guardian
      </Button>
    </>
  )
}

export default GuardianModal
