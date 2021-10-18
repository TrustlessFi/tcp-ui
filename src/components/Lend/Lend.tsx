import { useState } from "react"
import {
  Button,
} from 'carbon-components-react'
import LargeText from '../utils/LargeText'
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import { waitForHueBalance, waitForLendHueBalance, waitForMarket, getContractWaitFunction, waitForRates, waitForSDI } from '../../slices/waitFor'
import { openModal } from '../../slices/modal'
import { numDisplay }  from '../../utils/'
import PositionNumberInput from '../library/PositionNumberInput'
import { LendBorrowOption } from './'
import InputPicker from './library/InputPicker'
import { reason } from '../library/ErrorMessage'
import PositionMetadata from '../library/PositionMetadata'
import ErrorMessage from '../library/ErrorMessage'
import { selectionMade } from '../../slices/lendSelection'
import { TransactionType } from '../../slices/transactions/index'
import { ProtocolContract } from '../../slices/contracts/index'
import { getAPR } from './library'
import ApprovalButton from '../utils/ApprovalButton'
import { zeroIfNaN } from '../../utils/index';
import ConnectWalletButton from '../utils/ConnectWalletButton';
import RelativeLoading from '../library/RelativeLoading';

const Lend = () => {
  const dispatch = useAppDispatch()

  const hueBalance = waitForHueBalance(selector, dispatch)
  const lendHueBalance = waitForLendHueBalance(selector, dispatch)
  const market = waitForMarket(selector, dispatch)
  const rates = waitForRates(selector, dispatch)
  const sdi = waitForSDI(selector, dispatch)
  const marketContract = getContractWaitFunction(ProtocolContract.Market)(selector, dispatch)

  const userAddress = selector(state => state.wallet.address)

  const [amount, setAmount] = useState(0)

  const dataNull =
    hueBalance === null ||
    lendHueBalance === null ||
    market === null ||
    rates === null ||
    sdi === null ||
    marketContract === null

  const apr = dataNull ? 0 : getAPR({market, rates, sdi, hueBalance})

  const onChange = (option: LendBorrowOption) => dispatch(selectionMade(option))

  const newWalletBalance = dataNull ? 0 : hueBalance.userBalance - amount
  const lentHueCount = dataNull ? 0 : lendHueBalance.userBalance! * market.valueOfLendTokensInHue
  const newLentHueCount = lentHueCount + amount

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

  const failingDueToNonApprovalReason = Object.values(failures).filter(reason => reason.failing).length > 0

  failures['hueNotApproved'] = {
    message: 'Lending is not approved.',
    failing: dataNull ? false : zeroIfNaN(amount) !== 0 && (hueBalance.approval.Market === undefined || !hueBalance.approval.Market.approved),
  }

  const failureReasons: reason[] = Object.values(failures)
  const isFailing = dataNull ? false : failureReasons.filter(reason => reason.failing).length > 0

  const openLendDialog = () => {
    dispatch(openModal({
      args: {
        type: TransactionType.Lend,
        count: amount,
        Market: marketContract!,
      },
    }))
  }

  return (
    <>
      <div style={{position: 'relative'}}>
        <RelativeLoading show={userAddress !== null && dataNull} />
        <div>
          <LargeText>
            I have {dataNull ? '-' : numDisplay(hueBalance.userBalance, 2)} Hue available to deposit.
            <div />
            The current lend APR is {numDisplay(apr * 100, 2)}% but will vary over time due to market forces.
          </LargeText>
        </div>
        <LargeText>
          I want to
          <InputPicker options={LendBorrowOption} initialValue={LendBorrowOption.Lend} onChange={onChange} />
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
              value: (dataNull ? '-' : numDisplay(hueBalance.userBalance, 2)) + ' Hue',
            },{
              title: 'New Wallet Balance',
              value: (dataNull ? '-' : numDisplay(hueBalance.userBalance - amount, 2)) + ' Hue',
              failing: failures.notEnoughInWallet.failing,
            },{
              title: 'Current Hue Lent',
              value: numDisplay(lentHueCount, 2),
            },{
              title: 'New Hue Lent',
              value: numDisplay(newLentHueCount, 2)
            },
          ]} />
        </div>
      </div>
      <ApprovalButton
        disabled={failingDueToNonApprovalReason || zeroIfNaN(amount) === 0}
        token={ProtocolContract.Hue}
        protocolContract={ProtocolContract.Market}
        approvalLabels={{waiting: 'Approve Lend', approving: 'Approve in Metamask...', approved: 'Lend Approved'}}
      />
      <div style={{marginTop: 32, marginBottom: 32}}>
        {userAddress === null ? <ConnectWalletButton /> :
          <Button disabled={isFailing || amount === 0} onClick={openLendDialog}>
            Lend
          </Button>
        }
      </div>
      <div>
        <ErrorMessage reasons={failureReasons} />
      </div>
    </>
  )
}

export default Lend
