import { useState } from "react"
import LargeText from '../library/LargeText'
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import waitFor from '../../slices/waitFor'
import { numDisplay } from '../../utils/'
import PositionNumberInput from '../library/PositionNumberInput'
import PositionMetadata2 from '../library/PositionMetadata2'
import { reason } from '../library/ErrorMessage'
import ErrorMessage from '../library/ErrorMessage'
import { getAPR } from './library'
import { isZeroish } from '../../utils'
import { TransactionType } from '../../slices/transactions'
import CreateTransactionButton from '../library/CreateTransactionButton'
import TwoColumnDisplay from '../library/TwoColumnDisplay'
import ParagraphDivider from '../library/ParagraphDivider'
import SpacedList from '../library/SpacedList'

const Withdraw = () => {
  const dispatch = useAppDispatch()

  const { balances, marketInfo, ratesInfo, sdi, contracts } = waitFor([
    'balances',
    'marketInfo',
    'ratesInfo',
    'sdi',
    'contracts',
  ], selector, dispatch)

  const userAddress = selector(state => state.wallet.address)

  const [amount, setAmount] = useState(0)

  const dataNull =
    balances === null ||
    marketInfo === null ||
    ratesInfo === null ||
    sdi === null ||
    contracts === null

  const apr = dataNull ? 0 : getAPR({
    marketInfo,
    ratesInfo,
    sdi,
    lentHue:
      balances === null || contracts === null
        ? 0
        : balances.tokens[contracts.Hue].balances.Accounting
  })

  const lentHueCount = dataNull ? 0 : balances.tokens[contracts.LendHue].userBalance! * marketInfo.valueOfLendTokensInHue

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

  const convertHueToLendHue = (amount: number) => dataNull ? 1 : amount / marketInfo.valueOfLendTokensInHue
  const convertLendHueToHue = (amount: number) => dataNull ? 1 : amount * marketInfo.valueOfLendTokensInHue

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
      Withdraw
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
    <LargeText>
      You have {dataNull ? '-' : numDisplay(convertLendHueToHue(balances.tokens[contracts.LendHue].userBalance), 2)} Hue
      available to withdraw.

      <ParagraphDivider />

      The current lend APR is {numDisplay(apr * 100, 2)}% but will vary over time due to market forces.
    </LargeText>

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
