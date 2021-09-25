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
import { LendBorrowOptions } from './'
import InputPicker from './library/InputPicker'
import { reason } from '../Positions/library/ErrorMessage';
import PositionMetadata from '../Positions/library/PositionMetadata';
import ErrorMessage from '../Positions/library/ErrorMessage';



const Withdraw = ({onSelect}: {onSelect: (option: LendBorrowOptions) => void}) => {
  const dispatch = useAppDispatch()

  const hueBalance = waitForHueBalance(selector, dispatch)
  const lendHueBalance = waitForLendHueBalance(selector, dispatch)

  const [amount, setAmount] = useState(0)

  if (
    hueBalance === null ||
    lendHueBalance === null
  ) return <TextAreaSkeleton />

  const onChange = (option: LendBorrowOptions) => {
    if (option !== LendBorrowOptions.Withdraw) onSelect(option)
  }

  const newWalletBalance = hueBalance.userBalance - amount
  const newAccountBalance = lendHueBalance.userBalance + amount


  const failures: {[key in string]: reason} = {
    noValueEntered: {
      message: 'Please insert a value.',
      failing: amount === 0 || isNaN(amount),
      silent: true,
    },
    notEnoughInWallet: {
      message: 'Not enough in wallet.',
      failing: newWalletBalance < 0,
    },
  }

  const failureReasons: reason[] = Object.values(failures)
  const isFailing = failureReasons.filter(reason => reason.failing).length > 0

  return (
    <>
      <div>
        <LargeText>
          I have {numDisplay(hueBalance.userBalance, 2)} Hue available to deposit.
          <div />
          The current lend APR is {numDisplay(hueBalance.userBalance, 2)} but will vary over time.
        </LargeText>
      </div>
      <LargeText>
        I want to
        <InputPicker options={LendBorrowOptions} initialValue={LendBorrowOptions.Withdraw} onChange={onChange} />
        <PositionNumberInput
          id="withdrawInput"
          action={(value: number) => setAmount(value)}
          value={amount}
        />
        Hue.
      </LargeText>
      <div style={{marginTop: 36}}>
        <PositionMetadata items={[
          {
            title: 'Current Wallet Balance',
            value: numDisplay(hueBalance.userBalance, 2) + ' Hue',
            failing: false
          },{
            title: 'New Wallet Balance',
            value: numDisplay(hueBalance.userBalance - amount, 2) + ' Hue',
            failing: failures.notEnoughInWallet.failing,
          },{
            title: 'Current Hue Lent',
            value: numDisplay(lendHueBalance.userBalance, 2),
          },{
            title: 'New Hue Lent',
            value: numDisplay(newAccountBalance, 2)
          },
        ]} />
      </div>
      <div style={{marginTop: 32, marginBottom: 32}}>
        <Button disabled={isFailing}>
          Withdraw
        </Button>
        <ErrorMessage reasons={failureReasons} />
      </div>
    </>
  )
}

export default Withdraw
