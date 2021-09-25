import { useState } from "react"
import {
  Button,
  TextAreaSkeleton,
} from 'carbon-components-react'
import LargeText from '../utils/LargeText'
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import { waitForHueBalance, waitForLendHueBalance, waitForMarket, getContractWaitFunction, waitForRates, waitForSDI } from '../../slices/waitFor'
import { openModal } from '../../slices/modal'
import { numDisplay }  from '../../utils/'
import PositionNumberInput from '../Positions/library/PositionNumberInput';
import { LendBorrowOptions } from './'
import InputPicker from './library/InputPicker'
import { reason } from '../Positions/library/ErrorMessage';
import PositionMetadata from '../Positions/library/PositionMetadata';
import ErrorMessage from '../Positions/library/ErrorMessage';
import { TransactionType } from '../../slices/transactions/index';
import { ProtocolContract } from '../../slices/contracts/index';
import { getAPR } from './library'
import ApprovalButton from '../utils/ApprovalButton'

const Lend = ({onSelect}: {onSelect: (option: LendBorrowOptions) => void}) => {
  const dispatch = useAppDispatch()

  const hueBalance = waitForHueBalance(selector, dispatch)
  const lendHueBalance = waitForLendHueBalance(selector, dispatch)
  const market = waitForMarket(selector, dispatch)
  const rates = waitForRates(selector, dispatch)
  const sdi = waitForSDI(selector, dispatch)
  const marketContract = getContractWaitFunction(ProtocolContract.Market)(selector, dispatch)

  const [amount, setAmount] = useState(0)

  if (
    hueBalance === null ||
    lendHueBalance === null ||
    market === null ||
    rates === null ||
    sdi === null ||
    marketContract === null
  ) return <TextAreaSkeleton />

  const apr = getAPR({market, rates, sdi, hueBalance})

  console.log({lendTokenValueInHue: market.valueOfLendTokensInHue})

  const onChange = (option: LendBorrowOptions) => {
    if (option !== LendBorrowOptions.Lend) onSelect(option)
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

  const openLendDialog = () => {
    dispatch(openModal({
      args: {
        type: TransactionType.Lend,
        count: amount,
        Market: marketContract,
      },
    }))
  }

  return (
    <>
      <div>
        <LargeText>
          I have {numDisplay(hueBalance.userBalance, 2)} Hue available to deposit.
          <div />
          The current lend APR is {numDisplay(apr, 2)}% but will vary due to market forces over time.
        </LargeText>
      </div>
      <LargeText>
        I want to
        <InputPicker options={LendBorrowOptions} initialValue={LendBorrowOptions.Lend} onChange={onChange} />
        <PositionNumberInput
          id="lendInput"
          action={(value: number) => setAmount(value)}
          value={amount}
        />
        Hue.
      </LargeText>
      <div style={{marginTop: 36, marginBottom: 30}}>
        <PositionMetadata items={[
          {
            title: 'Current Wallet Balance',
            value: numDisplay(hueBalance.userBalance, 2) + ' Hue',
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
      <ApprovalButton
        token={ProtocolContract.Hue}
        protocolContract={ProtocolContract.Market}
        approvalLabels={{waiting: 'Approve Lend', approving: 'Approving Lend...', approved: 'Lend Approved'}}
      />
      <div style={{marginTop: 32, marginBottom: 32}}>
        <Button disabled={isFailing} onClick={openLendDialog}>
          Lend
        </Button>
        <ErrorMessage reasons={failureReasons} />
      </div>
    </>
  )
}

export default Lend
