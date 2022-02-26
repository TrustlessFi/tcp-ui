import { useHistory } from 'react-router-dom'
import { useState } from 'react'
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import waitFor from '../../slices/waitFor'
import { numDisplay } from '../../utils/'
import { reason } from '../library/ErrorMessage'
import FullNumberInput from '../library/FullNumberInput'
import { TransactionType } from '../../slices/transactions/index'
import { isZeroish } from '../../utils/'
import CreateTransactionButton from '../library/CreateTransactionButton'
import OneColumnDisplay from '../library/OneColumnDisplay'
import SpacedList from '../library/SpacedList'
import Text from '../library/Text'
import { Tile, Button } from 'carbon-components-react'

const DecreaseStake = () => {
  const dispatch = useAppDispatch()
  const history = useHistory()

  const { balances, marketInfo, ratesInfo, sdi, contracts } = waitFor([
    'balances',
    'marketInfo',
    'ratesInfo',
    'sdi',
    'contracts',
  ], selector, dispatch)

  const userAddress = selector(state => state.userAddress)

  const [amount, setAmount] = useState(0)

  const dataNull =
    balances === null ||
    marketInfo === null ||
    ratesInfo === null ||
    sdi === null ||
    contracts === null

  const lendHueWalletBalance =
    dataNull
    ? 0
    : (balances.tokens[contracts.LendHue].userBalance < 1e-3
        ? 0
        : balances.tokens[contracts.LendHue].userBalance - 1e-4)

  const lentHueCount = (dataNull ? 0 : lendHueWalletBalance * marketInfo.valueOfLendTokensInHue)
  const newLentHueCount = lentHueCount - amount
  const lendHueToPayBack = marketInfo === null ? 0 : amount / marketInfo.valueOfLendTokensInHue

  const failures: { [key in string]: reason } = {
    noValueEntered: {
      message: 'Please insert a value.',
      failing: isZeroish(amount),
      silent: true,
    },
    notEnoughLent: {
      message: 'Withdrawal is more than the total amount lent.',
      failing: newLentHueCount < 0,
      silent: true,
    },
  }

  const failureReasons: reason[] = Object.values(failures)
  const isFailing = dataNull ? false : failureReasons.filter(reason => reason.failing).length > 0

  const lendHueApproved = !dataNull && balances.tokens[contracts.LendHue].approval.Market.approved

  const columnOne =
    <Tile style={{padding: 40, marginTop: 40}}>
      <SpacedList spacing={40}>
        <Text size={28}>
          Withdraw
        </Text>
        <SpacedList spacing={5}>
          <Text size={18}>
            Current Balance
          </Text>
          <SpacedList row spacing={5}>
            <Text size={28}>
              {numDisplay(lentHueCount, 2)}
            </Text>
            <Text size={12}>
              Hue
            </Text>
          </SpacedList>
        </SpacedList>
        <FullNumberInput
          title='Amount to Withdraw'
          action={(value: number) => setAmount(value)}
          light
          value={parseFloat(numDisplay(amount, 2).replace(',', ''))}
          unit='Hue'
          // onFocusUpdate={setCollateralIsFocused}
          defaultButton={{
            title: 'Max',
            action: () => setAmount(lentHueCount),
          }}
        />
        <SpacedList row spacing={20} style={{marginTop: 50}}>
          {
            lendHueApproved
            ? <CreateTransactionButton
                disabled={isFailing || dataNull}
                size='md'
                txArgs={{
                  type: TransactionType.DecreaseStake,
                  count: lendHueToPayBack,
                  Market: contracts === null ? '' : contracts.Market,
                }}
              />
            : <CreateTransactionButton
                title='Approve'
                size='md'
                disabled={isFailing || dataNull}
                showDisabledInsteadOfConnectWallet={true}
                txArgs={{
                  type: TransactionType.ApproveLendHue,
                  LendHue: contracts === null ? '' : contracts.LendHue,
                  spenderAddress: contracts === null ? '' : contracts.Market,
                }}
              />
          }
          <Button
            key='withdraw'
            onClick={() => history.replace('/stake')}
            size='md'
            kind='secondary'>
            Cancel
          </Button>
        </SpacedList>
      </SpacedList>
    </Tile>

  return (
    <OneColumnDisplay
      columnOne={columnOne}
      light
      loading={userAddress !== null && dataNull}
      breadCrumbItems={[{ text: 'Positions', href: '/' }, 'Lend']}
    />
  )
}

export default DecreaseStake
