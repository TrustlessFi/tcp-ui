import { useEffect } from 'react'
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import waitFor from '../../slices/waitFor'
import { numDisplay } from '../../utils/'
import reason from '../library/ErrorReasonType'
import FullNumberInput from '../library/FullNumberInput'
import { TransactionType, txStake } from '../../slices/transactions'
import { setApprovingHue } from '../../slices/onboarding'
import { getAPR } from './library'
import { isZeroish } from '../../utils/'
import CreateTransactionButton from '../library/CreateTransactionButton'
import OneColumnDisplay from '../library/OneColumnDisplay'
import PositionInfoItem from '../library/PositionInfoItem'
import ActionSteps from '../library/ActionSteps'
import SpacedList from '../library/SpacedList'
import Text from '../library/Text'
import TitleText from '../library/TitleText'
import Bold from '../library/Bold'
import { red } from '@carbon/colors';
import { Tile, Button } from 'carbon-components-react'
import { setStakePage, StakePage, setIncreaseAmount } from '../../slices/staking'
import {
  Calculation32,
} from '@carbon/icons-react';

const IncreaseStake = () => {
  const dispatch = useAppDispatch()

  const {
    balances,
    marketInfo,
    ratesInfo,
    contracts,
    staking,
    sdi,
    userAddress,
    onboarding,
    protocolBalances,
  } = waitFor([
    'balances',
    'marketInfo',
    'ratesInfo',
    'contracts',
    'staking',
    'sdi',
    'userAddress',
    'onboarding',
    'protocolBalances',
  ], selector, dispatch)

  useEffect(() => {
    if (balances === null) return
    if (contracts === null) return
    if (!balances.tokens[contracts.Hue].approval.Market.approved) {
      dispatch(setApprovingHue(true))
    }
  }, [balances, contracts])

  const amount = staking.increaseAmount
  const setAmount = (value: number) => dispatch(setIncreaseAmount(value))

  const dataNull =
    balances === null ||
    marketInfo === null ||
    ratesInfo === null ||
    contracts === null ||
    sdi === null ||
    protocolBalances === null

  const apr = dataNull ? 0 : getAPR({
    marketInfo,
    ratesInfo,
    sdi,
    lentHue: protocolBalances.accountingHueBalance,
    additional: amount,
  })

  const currentWalletBalance =
    dataNull
    ? 0
    : (balances.tokens[contracts.Hue].userBalance < 1e-3
        ? 0
        : balances.tokens[contracts.Hue].userBalance - 1e-4)

  const newWalletBalance = dataNull ? 0 : currentWalletBalance - (isZeroish(amount) ? 0 : amount)
  const protoLentHueCount = dataNull ? 0 : balances.tokens[contracts.LendHue].userBalance * marketInfo.valueOfLendTokensInHue
  const lentHueCount = protoLentHueCount < 1e-3 ? 0 : protoLentHueCount - 1e-4

  const failures: { [key in string]: reason } = {
    noValueEntered: {
      message: 'Please insert a value.',
      failing: isZeroish(amount),
      silent: true,
    },
    notEnoughInWallet: {
      message: 'Not enough in wallet.',
      failing: newWalletBalance < 0,
      silent: true,
    },
  }

  const failureReasons: reason[] = Object.values(failures)
  const isFailing = dataNull ? false : failureReasons.filter(reason => reason.failing).length > 0

  const stakeArgs: txStake = {
    type: TransactionType.IncreaseStake,
    count: amount,
    Market: contracts === null ? '' : contracts.Market,
  }

  const hueApproved = !dataNull && balances.tokens[contracts.Hue].approval.Market.approved

  const stakeButton =
    <CreateTransactionButton
      disabled={isFailing || dataNull}
      size='md'
      txArgs={stakeArgs}
    />

  const cancelButton =
    <Button
      key='cancel_add'
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
            Stake Hue
          </Text>
          <SpacedList row spacing={5}>
            <TitleText>
              {numDisplay(lentHueCount, 2)}
            </TitleText>
            <Text>
              Hue Staked
            </Text>
          </SpacedList>
          <FullNumberInput
            title='Amount to Stake'
            action={(value: number) => setAmount(value)}
            light
            value={parseFloat(numDisplay(amount, 2).replace(',', ''))}
            unit='Hue'
            // onFocusUpdate={setCollateralIsFocused}
            defaultButton={{
              title: 'Max',
              action: () => setAmount(currentWalletBalance),
            }}
            subTitle={
              <Text>
                You have
                {' '}
                <Text color={currentWalletBalance < amount ? red[50]: undefined}>
                  <Bold>
                    {numDisplay(currentWalletBalance, 2)}{' '}
                    Hue
                  </Bold>
                </Text>
                {' '}
                in your wallet available to stake
              </Text>
            }
          />
          <PositionInfoItem
            key='apr_info'
            icon={<Calculation32 />}
            title='New APR'
            value={numDisplay(apr * 100, 2)}
            unit='%'
          />
          <div style={{marginTop: 40}}>
            {
              onboarding.approvingHue
              ? <SpacedList spacing={20}>
                  <ActionSteps
                    action='staking'
                    disabled={isFailing || dataNull}
                    steps={[
                      {
                        txArgs: {
                          type: TransactionType.ApproveHue,
                          Hue: contracts === null ? '' : contracts.Hue,
                          spenderAddress: contracts === null ? '' : contracts.Market,
                        },
                        title: 'Approve Stake',
                        buttonTitle: 'Approve',
                        complete: hueApproved,
                      },{
                        txArgs: stakeArgs,
                        title: 'Stake',
                        buttonTitle: 'Confirm',
                      }
                    ]}
                  />
                  {cancelButton}
                </SpacedList>
              : <SpacedList row spacing={20}>
                  {stakeButton}
                  {cancelButton}
                </SpacedList>
            }
          </div>
        </SpacedList>
      </Tile>
    </OneColumnDisplay>
  )
}

export default IncreaseStake
