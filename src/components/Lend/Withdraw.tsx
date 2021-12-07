import { useState } from "react"
import LargeText from '../utils/LargeText'
import { useHistory } from 'react-router-dom'
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import { waitForHueBalance, waitForLendHueBalance, waitForMarket, waitForContracts, waitForRates, waitForSDI } from '../../slices/waitFor'
import { numDisplay } from '../../utils/'
import PositionNumberInput from '../library/PositionNumberInput'
import PositionMetadata2 from '../library/PositionMetadata2'
import { LendBorrowOption } from './'
import InputPicker from './library/InputPicker'
import { reason } from '../library/ErrorMessage'
import PositionMetadata from '../library/PositionMetadata'
import ErrorMessage from '../library/ErrorMessage'
import { getAPR } from './library'
import { zeroIfNaN } from '../../utils/index';
import RelativeLoading from '../library/RelativeLoading';
import { TransactionType } from '../../slices/transactions/index';
import CreateTransactionButton from '../utils/CreateTransactionButton';
import TwoColumnDisplay from '../utils/TwoColumnDisplay'
import ParagraphDivider from '../utils/ParagraphDivider'

const Withdraw = () => {
  const dispatch = useAppDispatch()
  const history = useHistory()

  const hueBalance = waitForHueBalance(selector, dispatch)
  const lendHueBalance = waitForLendHueBalance(selector, dispatch)
  const market = waitForMarket(selector, dispatch)
  const rates = waitForRates(selector, dispatch)
  const sdi = waitForSDI(selector, dispatch)
  const contracts = waitForContracts(selector, dispatch)

  const userAddress = selector(state => state.wallet.address)

  const [amount, setAmount] = useState(0)

  const dataNull =
    hueBalance === null ||
    lendHueBalance === null ||
    market === null ||
    rates === null ||
    sdi === null ||
    contracts === null

  const apr = dataNull ? 0 : getAPR({ market, rates, sdi, hueBalance })

  const onChange = (option: LendBorrowOption) => {
    if (option === LendBorrowOption.Lend) history.push('lend')
  }

  const lentHueCount = dataNull ? 0 : lendHueBalance.userBalance! * market.valueOfLendTokensInHue

  const failures: { [key in string]: reason } = {
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


  const metadataItems = [
    {
      title: 'Current Wallet Balance',
      value: (dataNull ? '-' : numDisplay(hueBalance.userBalance, 2)) + ' Hue',
    }, {
      title: 'New Wallet Balance',
      value: (dataNull ? '-' : numDisplay(hueBalance.userBalance + amount, 2)) + ' Hue',
    }, {
      title: 'Current Hue Lent',
      value: numDisplay(lentHueCount, 2),
    }, {
      title: 'New Hue Lent',
      value: numDisplay(lentHueCount - amount, 2),
      failing: failures.notEnoughLent.failing,
    },
  ]

  const columnOne =
    <>
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
      <div style={{ marginTop: 36, marginBottom: 30 }}>
        <PositionMetadata2 items={metadataItems} />
      </div>
      <CreateTransactionButton
        title={"Approve Withdraw"}
        disabled={failingDueToNonApprovalReason || zeroIfNaN(amount) === 0 || dataNull || lendHueBalance.approval.Market ?.approved}
        showDisabledInsteadOfConnectWallet={true}
        shouldOpenTxTab={false}
        txArgs={{
          type: TransactionType.ApproveLendHue,
          LendHue: contracts === null ? '' : contracts.LendHue,
          spenderAddress: contracts === null ? '' : contracts.Market,
        }}
      />
      <div style={{ marginTop: 32, marginBottom: 32 }}>
        <CreateTransactionButton
          title="Withdraw"
          disabled={isFailing || amount === 0}
          txArgs={{
            type: TransactionType.Withdraw,
            count: convertHueToLendHue(amount),
            Market: contracts === null ? '' : contracts.Market,
          }}
        />
      </div>
      <div>
        <ErrorMessage reasons={failureReasons} />
      </div>
    </>

  const columnTwo =
    <div style={{ position: 'relative' }}>
      <RelativeLoading show={userAddress !== null && dataNull} />
      <div>
        <LargeText>
          I have {dataNull ? '-' : numDisplay(convertLendHueToHue(lendHueBalance.userBalance), 2)} Hue available to withdraw.

          <ParagraphDivider />

          The current lend APR is {numDisplay(apr * 100, 2)}% but will vary over time due to market forces.
          </LargeText>
      </div>
    </div>

  return (
    <TwoColumnDisplay
      columnOne={columnOne}
      columnTwo={columnTwo}
      loading={userAddress !== null && dataNull}
      breadCrumbItems={[{ text: 'Positions', href: '/' }, 'Withdraw']}
    />
  )
}

export default Withdraw
