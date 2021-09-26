import { useState } from "react"
import { Row, Col } from 'react-flexbox-grid'
import {
  Button,
  NumberInput,
  Dropdown,
  OnChangeData,
  TextAreaSkeleton,
} from 'carbon-components-react'
import LargeText from '../utils/LargeText'
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import { waitForHueBalance, waitForLendHueBalance, waitForMarket, waitForPrices, waitForLiquidations } from '../../slices/waitFor'
import {  numDisplay }  from '../../utils/'
import { first } from '../../utils'
import PositionNumberInput from '../Positions/library/PositionNumberInput';
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
