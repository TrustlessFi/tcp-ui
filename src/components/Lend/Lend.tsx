import { useState } from "react"
import LargeText from '../library/LargeText'
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import { waitForBalances, waitForMarket, waitForContracts, waitForRates, waitForSDI } from '../../slices/waitFor'
import { numDisplay } from '../../utils/'
import PositionNumberInput from '../library/PositionNumberInput'
import { reason } from '../library/ErrorMessage'
import PositionMetadata2 from '../library/PositionMetadata2'
import ErrorMessage from '../library/ErrorMessage'
import { TransactionType } from '../../slices/transactions/index'
import { getAPR } from './library'
import { isZeroish } from '../../utils/index'
import CreateTransactionButton from '../library/CreateTransactionButton'
import RelativeLoading from '../library/RelativeLoading'
import TwoColumnDisplay from '../library/TwoColumnDisplay'
import ParagraphDivider from '../library/ParagraphDivider'
import SpacedList from '../library/SpacedList'

const Lend = () => {
  const dispatch = useAppDispatch()

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

  const newWalletBalance = dataNull ? 0 : balances.tokens[contracts.Hue].userBalance - amount
  const lentHueCount = dataNull ? 0 : balances.tokens[contracts.LendHue].userBalance! * market.valueOfLendTokensInHue
  const newLentHueCount = lentHueCount + amount

  const failures: { [key in string]: reason } = {
    noValueEntered: {
      message: 'Please insert a value.',
      failing: isZeroish(amount),
      silent: true,
    },
    notEnoughInWallet: {
      message: 'Not enough in wallet.',
      failing: newWalletBalance < 0,
    },
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

  const hueApproved = !dataNull && balances.tokens[contracts.Hue].approval.Market.approved

  const columnOne =
    <SpacedList spacing={32}>
      <SpacedList spacing={8}>
        Lend
        <PositionNumberInput
          id="lendInput"
          action={(value: number) => setAmount(value)}
          value={amount}
        />
        Hue
      </SpacedList>
      <PositionMetadata2 items={metadataItems} />
      {
        hueApproved
        ? <CreateTransactionButton
            title='Lend'
            disabled={isFailing || dataNull}
            txArgs={{
              type: TransactionType.Lend,
              count: amount,
              Market: contracts === null ? '' : contracts.Market,
            }}
          />
        : <CreateTransactionButton
            title='Approve Lend'
            disabled={isFailing || dataNull}
            showDisabledInsteadOfConnectWallet={true}
            shouldOpenTxTab={false}
            txArgs={{
              type: TransactionType.ApproveHue,
              Hue: contracts === null ? '' : contracts.Hue,
              spenderAddress: contracts === null ? '' : contracts.Market,
            }}
          />
      }
      <ErrorMessage reasons={failureReasons} />
    </SpacedList>


  const columnTwo =
    <LargeText>
      You have {dataNull ? '-' : numDisplay(balances.tokens[contracts.Hue].userBalance, 2)} Hue available to deposit.

      <ParagraphDivider />

      The current lend APR is {numDisplay(apr * 100, 2)}% but will vary over time due to market forces.
    </LargeText>

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
