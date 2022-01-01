import { useState } from "react"
import LargeText from '../library/LargeText'
import { useHistory } from 'react-router-dom'
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import { waitForBalances, waitForMarket, waitForContracts, waitForRates, waitForSDI } from '../../slices/waitFor'
import { numDisplay } from '../../utils/'
import PositionNumberInput from '../library/PositionNumberInput'
import PositionMetadata2 from '../library/PositionMetadata2'
import { LendBorrowOption } from './'
import InputPicker from '../library/InputPicker'
import { reason } from '../library/ErrorMessage'
import ErrorMessage from '../library/ErrorMessage'
import { getAPR } from './library'
import { zeroIfNaN } from '../../utils/index';
import RelativeLoading from '../library/RelativeLoading';
import { TransactionType } from '../../slices/transactions/index';
import CreateTransactionButton from '../library/CreateTransactionButton';
import TwoColumnDisplay from '../library/TwoColumnDisplay'
import ParagraphDivider from '../library/ParagraphDivider'
import SpacedList from '../library/SpacedList'

const Withdraw = () => {
  const dispatch = useAppDispatch()
  const history = useHistory()

  const balances = waitForBalances(selector, dispatch)
  const market = waitForMarket(selector, dispatch)
  const rates = waitForRates(selector, dispatch)
  const sdi = waitForSDI(selector, dispatch)
  const contracts = waitForContracts(selector, dispatch)

  const userAddress = selector(state => state.wallet.address)

  const [amount, setAmount] = useState(0)

  const dataNull =
    balances === null ||
    market === null ||
    rates === null ||
    sdi === null ||
    contracts === null

  const apr = dataNull ? 0 : getAPR({
    market,
    rates,
    sdi,
    lentHue:
      balances === null || contracts === null
        ? 0
        : balances.tokens[contracts.Hue].balances.Accounting
  })

  const onChange = (option: LendBorrowOption) => {
    if (option === LendBorrowOption.Lend) history.push('lend')
  }

  const lentHueCount = dataNull ? 0 : balances.tokens[contracts.LendHue].userBalance! * market.valueOfLendTokensInHue

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
    failing:
      dataNull
      ? false : zeroIfNaN(amount) !== 0
      && (balances.tokens[contracts.LendHue].approval.Market === undefined || !balances.tokens[contracts.LendHue].approval.Market.approved),
  }

  const failureReasons: reason[] = Object.values(failures)
  const isFailing = failureReasons.filter(reason => reason.failing).length > 0

  const convertHueToLendHue = (amount: number) => dataNull ? 1 : amount / market.valueOfLendTokensInHue
  const convertLendHueToHue = (amount: number) => dataNull ? 1 : amount * market.valueOfLendTokensInHue


  const metadataItems = [
    {
      title: 'Current Wallet Balance',
      value: (dataNull ? '-' : numDisplay(balances.tokens[contracts.Hue].userBalance, 2)) + ' Hue',
    }, {
      title: 'New Wallet Balance',
      value: (dataNull ? '-' : numDisplay(balances.tokens[contracts.Hue].userBalance + amount, 2)) + ' Hue',
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
      <SpacedList>
        <InputPicker
          options={LendBorrowOption}
          initialValue={LendBorrowOption.Withdraw}
          onChange={onChange}
          label='Lend/Borrow options'
        />
        <PositionNumberInput
          id="lendInput"
          action={(value: number) => setAmount(value)}
          value={amount}
        />
        Hue
      </SpacedList>
      <div style={{ marginTop: 16, marginBottom: 30 }}>
        <PositionMetadata2 items={metadataItems} />
      </div>
      <CreateTransactionButton
        title={"Approve Withdraw"}
        disabled={
          failingDueToNonApprovalReason
          || zeroIfNaN(amount) === 0
          || dataNull
          || balances.tokens[contracts.LendHue].approval.Market.approved}
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
          You have {dataNull ? '-' : numDisplay(convertLendHueToHue(balances.tokens[contracts.LendHue].userBalance), 2)} Hue
          available to withdraw.

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
