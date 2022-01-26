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
  const [multiplier, setMultiplier] = useState(1.0)

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

  const currentWalletBalance =
    dataNull
    ? 0
    : (balances.tokens[contracts.Hue].userBalance < 1e-3
        ? 0
        : balances.tokens[contracts.Hue].userBalance - 1e-4)

  const newWalletBalance = dataNull ? 0 : currentWalletBalance - amount
  const protoLentHueCount = dataNull ? 0 : balances.tokens[contracts.LendHue].userBalance * marketInfo.valueOfLendTokensInHue
  const lentHueCount = protoLentHueCount < 1e-3 ? 0 : protoLentHueCount - 1e-4

  const UPDATE_FREQUENCY_MS = 100

  useEffect(() => {
    const aprPerInterval = 1 + ((apr / years(1)) / (1000 / UPDATE_FREQUENCY_MS))
    const interval = setInterval(() => {
      setMultiplier(multiplier => multiplier * aprPerInterval)
    }, UPDATE_FREQUENCY_MS);

    return () => clearInterval(interval);
  }, [apr])

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

  const hueApproved = !dataNull && balances.tokens[contracts.Hue].approval.Market.approved

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
              <Text size={32}>
                <Bold>
                  {numDisplay((lentHueCount * multiplier) + (isZeroish(amount) ? 0 : amount), 8)}
                </Bold>
              </Text>
            </Col>
            <Col style={{paddingBottom: 2, paddingLeft: 4}}>
              <Text>
                Hue
              </Text>
            </Col>
          </Row>
        </Center>
        <Center>
          <Text size={16}>
            Currently APR{' '}
            <Bold>{aprDisplay}%</Bold>
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
          action: () => setAmount(currentWalletBalance),
        }}
        subTitle={
          <Text>
            You have
            {' '}
            <Bold>
              {numDisplay(currentWalletBalance, 2)}
            </Bold>
            {' '}
            Hue in your wallet available to stake
          </Text>
        }
      />
    <Center>
      {
        hueApproved
        ? <CreateTransactionButton
            title='Stake'
            disabled={isFailing || dataNull}
            txArgs={{
              type: TransactionType.Lend,
              count: amount,
              Market: contracts === null ? '' : contracts.Market,
            }}
          />
        : <CreateTransactionButton
            title='Approve'
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
