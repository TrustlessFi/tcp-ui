import { Tile } from 'carbon-components-react'
import { TransactionType } from '../../slices/transactions'
import CreateTransactionButton from '../library/CreateTransactionButton'
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import SpacedList from '../library/SpacedList'
import Text from '../library/Text'
import waitFor from '../../slices/waitFor'

const CounterTile = () => {
  const dispatch = useAppDispatch()

  const {
    counterInfo,
    rootContracts,
  } = waitFor([
    'counterInfo',
    'rootContracts',
  ], selector, dispatch)

  return (
    <Tile>
      <SpacedList spacing={20} row>
        <Text>Counter: [{counterInfo === null ? 'Loading...' : counterInfo.counterValue}]</Text>
        <CreateTransactionButton
          disabled={counterInfo === null}
          size='sm'
          kind='ghost'
          title='Increment counter'
          txArgs={{
            type: TransactionType.IncrementCounter,
            counterValue: counterInfo === null ? 0 : counterInfo.counterValue,
            dataAggregator: rootContracts === null ? '' : rootContracts.protocolDataAggregator,
          }}
        />
      </SpacedList>
    </Tile>
  )
}

export default CounterTile
