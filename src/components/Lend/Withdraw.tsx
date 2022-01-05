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
import { isZeroish } from '../../utils'
import RelativeLoading from '../library/RelativeLoading'
import { TransactionType } from '../../slices/transactions'
import CreateTransactionButton from '../library/CreateTransactionButton'
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
      failing: isZeroish(amount),
      silent: true,
    },
    notEnoughLent: {
      message: 'Withdrawal is more than the total amount lent.',
      failing: lentHueCount - amount < 0,
    },
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

  const withdrawApproved =
    balances !== null &&
    contracts !== null &&
    balances.tokens[contracts.LendHue].approval.Market.approved

  const columnOne =
    <SpacedList spacing={32}>
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
      <PositionMetadata2 items={metadataItems} />
      {
        withdrawApproved
        ? <CreateTransactionButton
            title='Withdraw'
            disabled={isFailing || isZeroish(amount)}
            txArgs={{
              type: TransactionType.Withdraw,
              count: convertHueToLendHue(amount),
              Market: contracts === null ? '' : contracts.Market,
            }}
          />
        : <CreateTransactionButton
            title='Approve Withdraw'
            disabled={
              isFailing
              || isZeroish(amount)
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
      }
      <ErrorMessage reasons={failureReasons} />
    </SpacedList>

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
