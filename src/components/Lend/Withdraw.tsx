import { useState } from "react"
import LargeText from '../utils/LargeText'
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import { waitForHueBalance, waitForLendHueBalance, waitForMarket, getContractWaitFunction, waitForRates, waitForSDI } from '../../slices/waitFor'
import { numDisplay }  from '../../utils/'
import PositionNumberInput from '../library/PositionNumberInput'
import { LendBorrowOption } from './'
import InputPicker from './library/InputPicker'
import { reason } from '../library/ErrorMessage'
import PositionMetadata from '../library/PositionMetadata'
import ErrorMessage from '../library/ErrorMessage'
import { ProtocolContract } from '../../slices/contracts'
import { selectionMade } from '../../slices/lendSelection'
import { getAPR } from './library'
import { zeroIfNaN } from '../../utils/index';
import RelativeLoading from '../library/RelativeLoading';
import { TransactionType } from '../../slices/transactions/index';
import CreateTransactionButton from '../utils/CreateTransactionButton';

const Withdraw = () => {
  const dispatch = useAppDispatch()

  const hueBalance = waitForHueBalance(selector, dispatch)
  const lendHueBalance = waitForLendHueBalance(selector, dispatch)
  const market = waitForMarket(selector, dispatch)
  const rates = waitForRates(selector, dispatch)
  const sdi = waitForSDI(selector, dispatch)
  const marketContract = getContractWaitFunction(ProtocolContract.Market)(selector, dispatch)
  const lendHueContract = getContractWaitFunction(ProtocolContract.LendHue)(selector, dispatch)

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

  const lentHueCount = dataNull ? 0 : lendHueBalance.userBalance! * market.valueOfLendTokensInHue

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
    failing: dataNull ? false : zeroIfNaN(amount) !== 0 && (lendHueBalance.approval.Market === undefined || !lendHueBalance.approval.Market.approved),
  }

  const failureReasons: reason[] = Object.values(failures)
  const isFailing = failureReasons.filter(reason => reason.failing).length > 0

  const convertHueToLendHue = (amount: number) => dataNull ? 1 : amount / market.valueOfLendTokensInHue
  const convertLendHueToHue = (amount: number) => dataNull ? 1 : amount * market.valueOfLendTokensInHue

  return (
    <>
      <div style={{position: 'relative'}}>
        <RelativeLoading show={userAddress !== null && dataNull} />
        <div>
          <LargeText>
            I have {dataNull ? '-' : numDisplay(convertLendHueToHue(lendHueBalance.userBalance), 2)} Hue available to withdraw.
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
              value: (dataNull ? '-' : numDisplay(hueBalance.userBalance, 2)) + ' Hue',
            },{
              title: 'New Wallet Balance',
              value: (dataNull ? '-' : numDisplay(hueBalance.userBalance + amount, 2)) + ' Hue',
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
      </div>
      <CreateTransactionButton
        title={"Approve Withdraw"}
        disabled={failingDueToNonApprovalReason || zeroIfNaN(amount) === 0 || dataNull || lendHueBalance.approval.Market?.approved}
        showDisabledInsteadOfConnectWallet={true}
        shouldOpenTxTab={false}
        txArgs={{
          type: TransactionType.ApproveLendHue,
          LendHue: lendHueContract!,
          spenderAddress: marketContract!,
        }}
      />
      <div style={{marginTop: 32, marginBottom: 32}}>
        <CreateTransactionButton
          title="Withdraw"
          disabled={isFailing || amount === 0}
          txArgs={{
            type: TransactionType.Withdraw,
            count: convertHueToLendHue(amount),
            Market: marketContract!,
          }}
        />
      </div>
      <div>
        <ErrorMessage reasons={failureReasons} />
      </div>
    </>
  )
}

export default Withdraw
