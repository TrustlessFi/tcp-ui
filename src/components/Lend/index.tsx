import { useAppSelector as selector } from '../../app/hooks'
import Lend from './Lend'
import Withdraw from './Withdraw'

export enum LendBorrowOption {
  Lend = 'Lend',
  Withdraw = 'Withdraw',
}

const LendOrWithdraw = () => {
  const { optionSelected } = selector(state => state.lendSelection)

  return optionSelected === LendBorrowOption.Lend
    ? <Lend />
    : <Withdraw />
}

export default LendOrWithdraw
