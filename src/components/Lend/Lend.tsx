import { useState } from "react"
import { useHistory } from 'react-router-dom'
import LargeText from '../utils/LargeText'
import { LendBorrowOption } from './'
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import { waitForBalances, waitForMarket, waitForContracts, waitForRates, waitForSDI } from '../../slices/waitFor'
import { numDisplay } from '../../utils/'
import PositionNumberInput from '../library/PositionNumberInput'
import InputPicker from '../library/InputPicker'
import { reason } from '../library/ErrorMessage'
import PositionMetadata2 from '../library/PositionMetadata2'
import ErrorMessage from '../library/ErrorMessage'
import { TransactionType } from '../../slices/transactions/index'
import { getAPR } from './library'
import { zeroIfNaN } from '../../utils/index'
import CreateTransactionButton from '../utils/CreateTransactionButton'
import RelativeLoading from '../library/RelativeLoading'
import TwoColumnDisplay from '../utils/TwoColumnDisplay'
import ParagraphDivider from '../utils/ParagraphDivider'

const Lend = () => {
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
    if (option === LendBorrowOption.Withdraw) {
      history.push('withdraw')
    }
  }

  const newWalletBalance = dataNull ? 0 : balances.tokens[contracts.Hue].userBalance - amount
  const lentHueCount = dataNull ? 0 : balances.tokens[contracts.LendHue].userBalance! * market.valueOfLendTokensInHue
  const newLentHueCount = lentHueCount + amount

  const failures: { [key in string]: reason } = {
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
    failing:
      dataNull
        ? false
        : zeroIfNaN(amount) !== 0
        && (balances.tokens[contracts.Hue].approval.Market === undefined
          || !balances.tokens[contracts.Hue].approval.Market.approved),
  }

  const failureReasons: reason[] = Object.values(failures)
  const isFailing = dataNull ? false : failureReasons.filter(reason => reason.failing).length > 0


  const metadataItems = [
    {
      title: 'Current Wallet Balance',
      value: (dataNull ? '-' : numDisplay(balances.tokens[contracts.Hue].userBalance, 2)) + ' Hue',
    }, {
      title: 'New Wallet Balance',
      value: (dataNull ? '-' : numDisplay(balances.tokens[contracts.Hue].userBalance - amount, 2)) + ' Hue',
      failing: failures.notEnoughInWallet.failing,
    }, {
      title: 'Current Hue Lent',
      value: numDisplay(lentHueCount, 2),
    }, {
      title: 'New Hue Lent',
      value: numDisplay(newLentHueCount, 2)
    },
  ]


  const columnOne =
    <>
      <LargeText>
        I want to
        <InputPicker
          options={LendBorrowOption}
          initialValue={LendBorrowOption.Lend}
          onChange={onChange}
          label='Lend/Borrow options'
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
        title={"Approve Lend"}
        disabled={
          failingDueToNonApprovalReason
            || zeroIfNaN(amount) === 0
            || dataNull
            || balances.tokens[contracts.Hue].approval.Market.approved}
        showDisabledInsteadOfConnectWallet={true}
        shouldOpenTxTab={false}
        txArgs={{
          type: TransactionType.ApproveHue,
          Hue: contracts === null ? '' : contracts.Hue,
          spenderAddress: contracts === null ? '' : contracts.Market,
        }}
      />
      <div style={{ marginTop: 32, marginBottom: 32 }}>
        <CreateTransactionButton
          title="Lend"
          disabled={isFailing || amount === 0}
          txArgs={{
            type: TransactionType.Lend,
            count: amount,
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
          I have {dataNull ? '-' : numDisplay(balances.tokens[contracts.Hue].userBalance, 2)} Hue available to deposit.

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
      breadCrumbItems={[{ text: 'Positions', href: '/' }, 'Lend']}
    />
  )

}

export default Lend
