import { useEffect } from 'react'
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import waitFor from '../../slices/waitFor'
import { numDisplay } from '../../utils/'
import reason from '../library/ErrorReasonType'
import FullNumberInput from '../library/FullNumberInput'
import { TransactionType, txWithdraw } from '../../slices/transactions'
import { isZeroish } from '../../utils/'
import CreateTransactionButton from '../library/CreateTransactionButton'
import OneColumnDisplay from '../library/OneColumnDisplay'
import SpacedList from '../library/SpacedList'
import ActionSteps from '../library/ActionSteps'
import Text from '../library/Text'
import TitleText from '../library/TitleText'
import { Tile, Button } from 'carbon-components-react'
import { setStakePage, StakePage, setDecreaseAmount } from '../../slices/staking'
import { setApprovingLendHue } from '../../slices/onboarding'

const DecreaseStake = () => {
  const dispatch = useAppDispatch()

  const {
    balances,
    marketInfo,
    ratesInfo,
    contracts,
    staking,
    userAddress,
    onboarding,
  } = waitFor([
    'balances',
    'marketInfo',
    'ratesInfo',
    'contracts',
    'staking',
    'userAddress',
    'onboarding',
  ], selector, dispatch)

  useEffect(() => {
    if (balances === null) return
    if (contracts === null) return
    if (!balances.tokens[contracts.LendHue].approval.Market.approved) {
      dispatch(setApprovingLendHue(true))
    }
  }, [balances, contracts])

  const amount = staking.decreaseAmount
  const setAmount = (value: number) => dispatch(setDecreaseAmount(value))

  const dataNull =
    balances === null ||
    marketInfo === null ||
    ratesInfo === null ||
    contracts === null

  const lendHueWalletBalance =
    dataNull
    ? 0
    : (balances.tokens[contracts.LendHue].userBalance < 1e-3
        ? 0
        : balances.tokens[contracts.LendHue].userBalance - 1e-4)

  const lentHueCount = marketInfo === null ? 0 : lendHueWalletBalance * marketInfo.valueOfLendTokensInHue
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

  const withdrawArgs: txWithdraw = {
    type: TransactionType.DecreaseStake,
    count: lendHueToPayBack,
    Market: contracts === null ? '' : contracts.Market,
  }

  const withdrawButton =
    <CreateTransactionButton
      disabled={isFailing || dataNull}
      size='md'
      txArgs={withdrawArgs}
    />

  const cancelButton =
    <Button
      key='cancel_button'
      onClick={() => dispatch(setStakePage(StakePage.View))}
      size='md'
      kind='secondary'>
      Cancel
    </Button>

  return (
    <OneColumnDisplay light loading={userAddress !== null && dataNull}>
      <Tile style={{padding: 40, marginTop: 40}}>
        <SpacedList spacing={40}>
          <Text size={28}>
            Withdraw Hue
          </Text>
          <SpacedList spacing={5}>
            <SpacedList row spacing={5}>
              <TitleText>
                {numDisplay(lentHueCount, 4)}
              </TitleText>
              <Text>
                Hue Staked
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
          <SpacedList style={{marginTop: 40}}>
            {
              onboarding.approvingLendHue
              ? <SpacedList spacing={20}>
                  <ActionSteps
                    action='withdrawing'
                    disabled={isFailing || dataNull}
                    steps={[
                      {
                        txArgs: {
                          type: TransactionType.ApproveLendHue,
                          LendHue: contracts === null ? '' : contracts.LendHue,
                          spenderAddress: contracts === null ? '' : contracts.Market,
                        },
                        title: 'Approve Withdraw',
                        buttonTitle: 'Approve',
                        complete: lendHueApproved,
                      },{
                        txArgs: withdrawArgs,
                        title: 'Withdraw',
                        buttonTitle: 'Confirm',
                      }
                    ]}
                  />
                  {cancelButton}
                </SpacedList>
              : <SpacedList row spacing={20}>
                  {withdrawButton}
                  {cancelButton}
                </SpacedList>
            }
          </SpacedList>
        </SpacedList>
      </Tile>
    </OneColumnDisplay>
  )
}

export default DecreaseStake
