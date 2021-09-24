import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import { getContractWaitFunction } from '../../slices/waitFor'
import TxConfirmController from '../Write/TxConfirmController'
import { createPosition } from '../../slices/positions'
import { RootState } from '../../app/store';
import { ProtocolContract } from '../../slices/contracts/index';
import { numDisplay } from '../../utils/'
import Text from '../utils/Text'
import LargeText from '../utils/LargeText'
import { lend, withdraw } from '../../slices/market/'


export enum LendBorrowOptions {
  Lend = 'Lend',
  Borrow = 'Withdraw',
}


const LendController = ({
  option,
  amount,
  onCancel,
  isActive,
}: {
  option: LendBorrowOptions,
  amount: number,
  onCancel: () => void
  isActive: boolean
}) => {
  const dispatch = useAppDispatch()

  const Market = getContractWaitFunction(ProtocolContract.Market)(selector, dispatch)
  if (Market === null) throw new Error('CreatePositionController: Market null')

  const mediumName =
    option
    + 'ing '
    + numDisplay(amount, 2)
    + ' Hue.'

  const thunk = option === LendBorrowOptions.Lend
    ? lend({amount, Market})
    : withdraw({amount, Market})

  return (
    <TxConfirmController
      thunk={thunk}
      preview={<>{mediumName}</>}
      verb={option}
      mediumName={mediumName}
      shortName={'Position Creation'}
      onCancel={onCancel}
      isActive={isActive}
      stateSelector={(state: RootState) => state.market}
    />
  )
}

export default LendController
