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
import PositionNumberInput from '../Positions/library/PositionNumberInput'
import { LendBorrowOption } from './'
import InputPicker from './library/InputPicker'
import { reason } from '../Positions/library/ErrorMessage'
import PositionMetadata from '../Positions/library/PositionMetadata'
import ErrorMessage from '../Positions/library/ErrorMessage'
import { TransactionType } from '../../slices/transactions'
import { ProtocolContract } from '../../slices/contracts'
import { selectionMade } from '../../slices/lendSelection'
import { getAPR } from './library'
import ApprovalButton from '../utils/ApprovalButton'
import { zeroIfNaN } from '../../utils/index';

const Withdraw = () => {
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
  console.log({apr})

  const onChange = (option: LendBorrowOption) => dispatch(selectionMade(option))

  const lentHueCount = lendHueBalance.userBalance! * market.valueOfLendTokensInHue

  const failures: {[key in string]: reason} = {
    noValueEntered: {
      message: 'Please insert a value.',
      failing: amount === 0 || isNaN(amount),
      silent: true,
    },
    notEnoughLent: {
      message: 'Withdrawal is more than the total amount lent.',
      failing: lentHueCount - amount < 0,
    },
  }

  const failingDueToNonApprovalReason = Object.values(failures).filter(reason => reason.failing).length > 0

  failures['lendHueNotApproved'] = {
    message: 'Withdrawal is not approved.',
    failing: zeroIfNaN(amount) !== 0 && (lendHueBalance.approval.Market === undefined || !lendHueBalance.approval.Market.approved),
  }

  const failureReasons: reason[] = Object.values(failures)
  const isFailing = failureReasons.filter(reason => reason.failing).length > 0

  const convertHueToLendHue = (amount: number) => amount / market.valueOfLendTokensInHue
  const convertLendHueToHue = (amount: number) => amount * market.valueOfLendTokensInHue

  const openLendDialog = () => {
    dispatch(openModal({
      args: {
        type: TransactionType.Withdraw,
        count: convertHueToLendHue(amount),
        Market: marketContract,
      },
    }))
  }

  return (
    <>
      <div>
        <LargeText>
          I have {numDisplay(convertLendHueToHue(lendHueBalance.userBalance), 2)} Hue available to withdraw.
          <div />
          The current lend APR is {numDisplay(apr * 100, 2)}% but will vary over time due to market forces.
        </LargeText>
      </div>
      <LargeText>
        I want to
        <InputPicker
          options={LendBorrowOption}
          initialValue={LendBorrowOption.Withdraw}
          onChange={onChange}
        />
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
            value: numDisplay(hueBalance.userBalance + amount, 2) + ' Hue',
          },{
            title: 'Current Hue Lent',
            value: numDisplay(lentHueCount, 2),
          },{
            title: 'New Hue Lent',
            value: numDisplay(lentHueCount - amount, 2),
            failing: failures.notEnoughLent.failing,
          },
        ]} />
      </div>
      <ApprovalButton
        disabled={failingDueToNonApprovalReason || zeroIfNaN(amount) === 0}
        token={ProtocolContract.LendHue}
        protocolContract={ProtocolContract.Market}
        approvalLabels={{waiting: 'Approve Withdraw', approving: 'Approving Withdraw...', approved: 'Withdraw Approved'}}
      />
      <div style={{marginTop: 32, marginBottom: 32}}>
        <Button disabled={isFailing} onClick={openLendDialog}>
          Withdraw
        </Button>
      </div>
      <div>
        <ErrorMessage reasons={failureReasons} />
      </div>
    </>
  )
}

export default Withdraw
