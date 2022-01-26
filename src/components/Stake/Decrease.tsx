import { useState, useEffect } from "react"
import { Row, Col } from 'react-flexbox-grid'
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import waitFor from '../../slices/waitFor'
import { numDisplay } from '../../utils/'
import { reason } from '../library/ErrorMessage'
import FullNumberInput from '../library/FullNumberInput'
import { TransactionType } from '../../slices/transactions/index'
import { getAPR } from './library'
import { isZeroish, years } from '../../utils/'
import CreateTransactionButton from '../library/CreateTransactionButton'
import OneColumnDisplay from '../library/OneColumnDisplay'
import SpacedList from '../library/SpacedList'
import Text from '../library/Text'
import Center from '../library/Center'
import Bold from '../library/Bold'
import { red, green } from '@carbon/colors';

const Increase = () => {
  const dispatch = useAppDispatch()

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

  const apr = dataNull ? 0 : getAPR({
    marketInfo,
    ratesInfo,
    sdi,
    lentHue:
      balances === null || contracts === null
        ? 0
        : balances.tokens[contracts.Hue].balances.Accounting
  })

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

  /*
  const metadataItems = [
    {
      title: 'Current Wallet Balance',
      value: (dataNull ? '-' : numDisplay(currentWalletBalance, 2)) + ' Hue',
    }, {
      title: 'New Wallet Balance',
      value: (dataNull ? '-' : numDisplay(newWalletBalance, 2)) + ' Hue',
      failing: failures.notEnoughInWallet.failing,
    }, {
      title: 'Current Hue Lent',
      value: numDisplay(lentHueCount, 2),
    }, {
      title: 'New Hue Lent',
      value: numDisplay(newLentHueCount, 2)
    },
  ]
  */

  const aprDisplay = numDisplay(apr * 100, 2)

  const lendHueApproved = !dataNull && balances.tokens[contracts.LendHue].approval.Market.approved

  const columnOne =
    <SpacedList spacing={48}>
      <SpacedList spacing={12}>
        <Center>
          <Text size={24}>
            Total Vault Balance
          </Text>
        </Center>
        <Center>
          <Row bottom="xs">
            <Col>
              <Text color={failures.notEnoughLent.failing ? red[50] : undefined} size={32}>
                <Bold>
                  {numDisplay(newLentHueCount, 2)}
                </Bold>
              </Text>
            </Col>
            <Col style={{paddingBottom: 2, paddingLeft: 4}}>
              <Text color={failures.notEnoughLent.failing ? red[50] : undefined}>
                Hue
              </Text>
            </Col>
          </Row>
        </Center>
        <Center>
          <Text size={16}>
            Currently earning{' '}
            <Bold>{aprDisplay}%</Bold>{' '}APR
          </Text>
        </Center>
      </SpacedList>
      <FullNumberInput
        action={setAmount}
        light
        value={parseFloat(numDisplay(amount, 2).replace(',', ''))}
        unit='Hue'
        // onFocusUpdate={setCollateralIsFocused}
        center
        defaultButton={{
          title: 'Max',
          action: () => setAmount(lentHueCount),
        }}
        subTitle={
          <Text>
            You have
            {' '}
            <Bold>
              {numDisplay(lentHueCount, 2)}
            </Bold>
            {' '}
            Hue staked available to withdraw
          </Text>
        }
      />
    <Center>
      {
        lendHueApproved
        ? <CreateTransactionButton
            title='Withdraw'
            disabled={isFailing || dataNull}
            txArgs={{
              type: TransactionType.Withdraw,
              count: lendHueToPayBack,
              Market: contracts === null ? '' : contracts.Market,
            }}
          />
        : <CreateTransactionButton
            title='Approve'
            disabled={isFailing || dataNull}
            showDisabledInsteadOfConnectWallet={true}
            shouldOpenTxTab={false}
            txArgs={{
              type: TransactionType.ApproveLendHue,
              LendHue: contracts === null ? '' : contracts.LendHue,
              spenderAddress: contracts === null ? '' : contracts.Market,
            }}
          />
      }
    </Center>
  </SpacedList>

  return (
    <OneColumnDisplay
      columnOne={columnOne}
      loading={userAddress !== null && dataNull}
      breadCrumbItems={[{ text: 'Positions', href: '/' }, 'Lend']}
    />
  )
}

export default Increase
