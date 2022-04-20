import { useState, useEffect, ReactFragment, ReactNode } from "react"
import {
  Tag32,
  Locked32,
  ErrorOutline32,
  Calculation32,
} from '@carbon/icons-react';
import FullNumberInput from '../library/FullNumberInput'
import PositionInfoItem from '../library/PositionInfoItem'
import Bold from '../library/Bold'
import TitleText from '../library/TitleText'
import Center from '../library/Center'
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import waitFor from '../../slices/waitFor'
import { Position } from '../../slices/positions'
import {
  numDisplay, roundToXDecimals, isZeroish, empty, hours, years,
} from '../../utils/'
import reason from '../library/ErrorReasonType'
import SpacedList from '../library/SpacedList'
import ClaimRewardsButton from '../library/ClaimRewardsButton'
import ActionSteps from '../library/ActionSteps'
import {
  TransactionType,
  TransactionStatus,
  txApproveEth,
  txUpdatePosition,
  txCreatePosition,
  txApproveHue,
} from '../../slices/transactions'
import CreateTransactionButton from '../library/CreateTransactionButton'
import { WalletToken } from '../library/TrustlessLogos'
import Text from '../library/Text'
import OneColumnDisplay from '../library/OneColumnDisplay'
import { InlineNotification, Button, Tile } from 'carbon-components-react'
import { getCollateralRatioColor } from './'
import { setApprovingEth, setApprovingHue } from '../../slices/onboarding'

const COLLATERAL_DECIMALS = 4
const DEBT_DECIMALS = 4
const DEFAULT_COLLATERALIZATION_RATIO = 2.5

const ManagePosition = () => {
  const dispatch = useAppDispatch()

  const {
    liquidationsInfo,
    balances,
    pricesInfo,
    marketInfo,
    ratesInfo,
    contracts,
    positions,
    userAddress,
    transactions,
    onboarding,
  } = waitFor([
    'liquidationsInfo',
    'balances',
    'pricesInfo',
    'marketInfo',
    'ratesInfo',
    'contracts',
    'positions',
    'userAddress',
    'transactions',
    'onboarding',
  ], selector, dispatch)

  const [debtIsFocused, setDebtIsFocused] = useState(false)
  const [collateralIsFocused, setCollateralIsFocused] = useState(false)

  const [deleteSelected, setDeleteSelected] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  const [collateralCount, setCollateralCount] = useState(0)
  const [debtCount, setDebtCount] = useState(0)

  const dataNull =
    liquidationsInfo === null ||
    balances === null ||
    pricesInfo === null ||
    marketInfo === null ||
    ratesInfo === null ||
    contracts === null ||
    positions === null ||
    userAddress === null

  const getHourAPR = () =>
    ratesInfo === null || ratesInfo.interestRate <= 0
    ? 1
    : 1 + ((ratesInfo.interestRate * hours(1)) / years(1))

  useEffect(() => {
    if (positions === null || ratesInfo === null) return
    setDeleteSelected(false)
    const noPositions = Object.values(positions).length === 0

    const setCreating = (isCreating: boolean, collateralCount = 0, debtCount = 0) => {
      setCollateralCount(isCreating ? 0 : collateralCount)
      setDebtCount(isCreating ? 0 : debtCount)
      setIsCreating(isCreating)
      setIsEditing(isCreating)
    }

    if (noPositions) {
      setCreating(true)
    } else {
      const position: Position = Object.values(positions)[0]
      if (position.collateralCount === 0 && position.debtCount === 0) {
        setCreating(true)
      } else {
        setCreating(false, position.collateralCount, position.debtCount * getHourAPR())
      }
    }
  }, [positions, ratesInfo])

  useEffect(() => {
    if (balances === null) return
    if (contracts === null) return
    if (!balances.tokens[contracts.TruEth].approval.Market.approved) {
      dispatch(setApprovingEth(true))
    }
    if (!balances.tokens[contracts.Hue].approval.Market.approved) {
      dispatch(setApprovingHue(true))
    }
  }, [balances, contracts])

  const position: null | Position = positions === null || Object.values(positions).length === 0 ? null : Object.values(positions)[0]
  const positionDebtCount =
    position === null
    ? 0
    : position.debtCount * getHourAPR()

  const collateralIncrease = collateralCount - (position === null ? 0 : position.collateralCount)
  const debtIncrease = parseFloat(roundToXDecimals(debtCount - positionDebtCount, DEBT_DECIMALS))
  const isCollateralChanged = Math.abs(collateralIncrease) > 0.001
  const isDebtChanged = Math.abs(debtIncrease) > 0.1
  const isDebtDecrease = isDebtChanged && debtIncrease < 0

  const collateralization = pricesInfo === null ? null : (collateralCount * pricesInfo.ethPrice) / debtCount
  const collateralizationDisplay = collateralization === null ? '-%' : numDisplay(collateralization * 100, 0) + '%'

  const previousCollateralization =
    pricesInfo === null || position === null
    ? null
    : (position.collateralCount * pricesInfo.ethPrice) / positionDebtCount

  const liquidationPrice = marketInfo === null ? 0 : (debtCount * marketInfo.collateralizationRequirement) / (collateralCount)
  const liquidationPriceDisplay = dataNull ? '-' : numDisplay(liquidationPrice, 0)

  const previousLiquidationPrice =
    marketInfo === null
    || position === null
    ? null
    : (positionDebtCount * marketInfo.collateralizationRequirement) / position.collateralCount

  const collateralizationRequirement = marketInfo === null ? null : marketInfo.collateralizationRequirement

  const interestRate = dataNull ? 0 : ratesInfo.interestRate * 100
  const interestRateDisplay = dataNull ? '-' : numDisplay(interestRate, 2)

  const ethPrice = pricesInfo === null ? null : pricesInfo.ethPrice
  const ethPriceDisplay = ethPrice === null ? '-' : numDisplay(ethPrice, 0)

  const txCostBuffer = 0.05

  const hueApproved =
    balances !== null &&
    contracts !== null &&
    balances.tokens[contracts.Hue].approval.Market !== undefined &&
    balances.tokens[contracts.Hue].approval.Market.approved

  const ethApproved =
    balances !== null &&
    contracts !== null &&
    balances.tokens[contracts.TruEth].approval.Market !== undefined &&
    balances.tokens[contracts.TruEth].approval.Market.approved

  const setCollateralCountToMax = () => {
    const userEthBalance =
      balances !== null && balances.userEthBalance > txCostBuffer
      ? balances.userEthBalance - txCostBuffer
      : 0
    const positionCollateral = position === null ? 0 : position.collateralCount

    updateCollateralCount(userEthBalance + positionCollateral)
  }

  const setDebtToHighCollateralRatio = () => {
    if (ethPrice === null) return
    updateDebtCountImpl(Math.floor((collateralCount * ethPrice) / DEFAULT_COLLATERALIZATION_RATIO))
  }

  const updateCollateralCount = (countCollateral: number) => {
    if (countCollateral !== 0) setDeleteSelected(false)
    setCollateralCount(parseFloat(roundToXDecimals(countCollateral, COLLATERAL_DECIMALS, true)))
  }

  const updateDebtCount = (countDebt: number) => {
    updateDebtCountImpl(countDebt)
  }

  const updateDebtCountImpl = (countDebt: number) => {
    if (countDebt !== 0) setDeleteSelected(false)
    setDebtCount(countDebt)
  }

  const cancelCreate = () => {
    if (!empty(
      Object.values(transactions)
        .filter(tx => tx.status === TransactionStatus.Pending)
        .filter(tx => tx.type === TransactionType.ApproveHue || tx.type === TransactionType.CreatePosition))
    ) return

    updateDebtCountImpl(0)
    updateCollateralCount(0)
  }

  const cancelUpdate = () => {
    if (!empty(
      Object.values(transactions)
        .filter(tx => tx.status === TransactionStatus.Pending)
        .filter(tx => tx.type === TransactionType.ApproveHue || tx.type === TransactionType.UpdatePosition))
    ) return

    setIsEditing(false)

    if (position !== null) {
      updateDebtCountImpl(positionDebtCount)
      updateCollateralCount(position.collateralCount)
    }
  }

  const failures: { [key in string]: reason } = dataNull ? {} : {
    noChange: {
      message: '.',
      failing: !isDebtChanged && !isCollateralChanged,
      silent: true,
    },
    invalidInput: {
      message: '.',
      failing: isNaN(debtCount) || isNaN(collateralCount),
      silent: true,
    },
    notBigEnough: {
      message: `Your position has less than ${marketInfo === null ? '-' : numDisplay(marketInfo.minPositionSize)} Hue of debt.`,
      silent: debtIsFocused,
      failing: (marketInfo === null ? false : 0 < debtCount && debtCount < marketInfo.minPositionSize),
    },
    insufficientEthInWallet: {
      message: 'You don\'t have enough TruEth in your wallet.',
      failing: balances === null || collateralIncrease === null ? false : balances.userEthBalance < collateralIncrease,
    },
    insufficientHueInWallet: {
      message: 'You don\'t have enough Hue in your wallet.',
      silent: debtIsFocused,
      failing:
        balances === null ||
        contracts === null ||
        (isDebtChanged && balances.tokens[contracts.Hue].userBalance + debtIncrease < 0),
    },
    undercollateralized: {
      message: 'Your position has a collateral ratio less than ' + numDisplay(marketInfo === null ? 0 : marketInfo.collateralizationRequirement * 100) + '%.',
      silent: debtIsFocused || collateralIsFocused,
      failing:
        (marketInfo === null ||
        collateralization === null
        ? false
        : debtCount !== 0 && collateralization < marketInfo.collateralizationRequirement),
    },
  }

  const failureReasons: reason[] = Object.values(failures)
  const isFailing = failureReasons.filter(reason => reason.failing).length > 0 || dataNull

  const collateralColor =
    collateralizationRequirement !== null && collateralization !== null && !isZeroish(collateralization)
    ? getCollateralRatioColor(collateralization, collateralizationRequirement)
    : undefined

  const cancelCreateButton =
    <Button
      key='cancel_create_button'
      disabled={collateralIncrease === 0 && debtIncrease === 0}
      onClick={cancelCreate}
      kind='secondary'
      size='md'>
      Cancel
    </Button>

  const cancelUpdateButton =
    <Button
      key='cancel_update_button'
      onClick={cancelUpdate}
      kind='secondary'
      size='md'>
      Cancel
    </Button>

  const editButton =
    isEditing
    ? null
    : <Button
        key='edit_button'
        onClick={() => setIsEditing(true)}
        size='sm'
        small
        kind='primary'>
        Edit Position
      </Button>

  const createPositionArgs: txCreatePosition | txUpdatePosition =
    position === null
    ? {
        type: TransactionType.CreatePosition,
        collateralCount,
        debtCount,
        Market: contracts === null ? '' : contracts.Market,
      }
    : {
        type: TransactionType.UpdatePosition,
        positionID: position === null ? 0 :  position.id,
        collateralIncrease: collateralCount,
        debtIncrease: debtCount,
        Market: contracts === null ? '' : contracts.Market,
      }

  const createPositionButton =
    <CreateTransactionButton
      title='Confirm'
      key='create_button'
      disabled={isFailing}
      size='md'
      txArgs={createPositionArgs}
    />

  const updatePositionArgs: txUpdatePosition = {
    type: TransactionType.UpdatePosition,
    positionID: position === null ? 0 :  position.id,
    collateralIncrease: position !== null && isCollateralChanged ? collateralCount - position.collateralCount : 0,
    debtIncrease: position !== null && isDebtChanged ? (debtCount === 0 ? -(positionDebtCount * 2) : debtCount - positionDebtCount) : 0,
    Market: contracts === null ? '' : contracts.Market,
  }

  const updatePositionButton =
    <CreateTransactionButton
      title='Confirm'
      key='update_button'
      disabled={isFailing}
      size='md'
      txArgs={updatePositionArgs}
    />

  const approveHueTxArgs: txApproveHue = {
    type: TransactionType.ApproveHue,
    Hue: contracts === null ? '' : contracts.Hue,
    spenderAddress: contracts === null ? '' : contracts.Market,
  }

  const approveEthTitle = 'Approve TruEth'
  const approveEthTxArgs: txApproveEth = {
    type: TransactionType.ApproveEth,
    Eth: contracts === null ? '' : contracts.TruEth,
    spenderAddress: contracts === null ? '' : contracts.Market,
  }

  interface changeDisplay {amount: string, action: string}

  const debtChangeSuccessDisplay: null | changeDisplay =
    debtIncrease === 0
    ? null
    : (debtIncrease > 0
      ? {action: 'receive', amount: `${numDisplay(debtIncrease, DEBT_DECIMALS)} Hue`}
      : {action: 'pay', amount: `${numDisplay(Math.abs(debtIncrease), DEBT_DECIMALS)} Hue`})

  const collateralChangeSuccessDisplay: null | changeDisplay =
    collateralIncrease === 0
    ? null
    : (collateralIncrease > 0
      ? {action: 'deposit', amount: `${numDisplay(collateralIncrease, COLLATERAL_DECIMALS)} Eth`}
      : {action: 'receive', amount: `${numDisplay(Math.abs(collateralIncrease), COLLATERAL_DECIMALS)} Eth`})

  const successDisplay: ReactFragment | null =
    debtChangeSuccessDisplay === null && collateralChangeSuccessDisplay === null
    ? null
    : (debtChangeSuccessDisplay !== null && collateralChangeSuccessDisplay !== null
        ? <Text>
            You will {collateralChangeSuccessDisplay.action} <Bold>{collateralChangeSuccessDisplay.amount}</Bold>{' '}
            and {debtChangeSuccessDisplay.action} <Bold>{debtChangeSuccessDisplay.amount}</Bold>.
          </Text>
        : (
          debtChangeSuccessDisplay !== null
          ? <Text>You will {debtChangeSuccessDisplay.action} <Bold>{debtChangeSuccessDisplay.amount}</Bold>.</Text>
          : <Text>You will {collateralChangeSuccessDisplay!.action} <Bold>{collateralChangeSuccessDisplay!.amount}</Bold>.</Text>
        )
      )

  const nonSilentFailures =
    Object.values(failures)
      .filter(failure => !failure.silent)
      .filter(failure => failure.failing)

  const getMultiButtonDisplay = (leftButtons: ReactNode[], showClose = false) =>
    showClose
    ? <div style={{display: 'flex', borderColor: 'red'}}>
        <SpacedList
          row
          spacing={20}
          style={{float: 'left', width: '100%', marginRight: '1em', whiteSpace: 'nowrap'}}>
          {leftButtons}
        </SpacedList>
        {
          isEditing
          && position !== null
          ? <div
              style={{float: 'right'}}>
              <Button
                disabled={deleteSelected || (position.collateralCount === 0 && positionDebtCount === 0)}
                onClick={() => {
                  setDebtCount(0)
                  setCollateralCount(0)
                  setDeleteSelected(true)
                }}
                kind='danger--ghost'
                size='md'>
                <span style={{whiteSpace: 'nowrap'}}>
                  Close Position
                </span>
              </Button>
            </div>
          : null
        }
      </div>
    : <SpacedList
        row
        spacing={20}
        style={{float: 'left', width: '100%', marginRight: '1em', whiteSpace: 'nowrap'}}>
        {leftButtons}
      </SpacedList>

  const columnOne =
    <>
      <Tile style={{padding: 40, marginTop: 40}}>
        <SpacedList spacing={40}>
          <div style={{display: 'float', alignItems: 'center'}}>
            <div style={{float: 'right'}}>
              <Center>
              {isCreating ? null : editButton}
              </Center>
            </div>
            {
              <TitleText>
                {isCreating ? 'Create Position' : 'Your Position'}
              </TitleText>
            }
          </div>
          <FullNumberInput
            key='collateral_input'
            title='Collateral'
            action={updateCollateralCount}
            value={parseFloat(roundToXDecimals(collateralCount, COLLATERAL_DECIMALS))}
            unit='TruEth'
            light
            frozen={!isEditing || deleteSelected}
            defaultButton={{
              title: 'Max',
              action: setCollateralCountToMax
            }}
            onFocusUpdate={setCollateralIsFocused}
            subTitle={
              <Text>
                You have
                {' '}
                <Bold>
                  {balances === null ? '-' : numDisplay(balances.userEthBalance, COLLATERAL_DECIMALS)}
                </Bold>
                {' '}
                TruEth in your wallet
              </Text>
            }
          />
          <FullNumberInput
            key='debt_input'
            title='Debt'
            action={updateDebtCount}
            value={parseFloat(roundToXDecimals(debtCount, DEBT_DECIMALS))}
            unit='Hue'
            light
            frozen={!isEditing || deleteSelected}
            defaultButton={{
              title: `${DEFAULT_COLLATERALIZATION_RATIO * 100}%`,
              action: setDebtToHighCollateralRatio,
            }}
            onFocusUpdate={setDebtIsFocused}
            subTitle={
              <Text>
                You have
                {' '}
                <Bold>
                  {
                    contracts === null
                    || balances === null
                    ? '-'
                    : numDisplay(balances.tokens[contracts.Hue].userBalance, DEBT_DECIMALS)}
                </Bold>
                {' '}
                Hue in your wallet
              </Text>
            }
          />
          <SpacedList spacing={20} >
            <PositionInfoItem
              key='liquidation_info'
              icon={<ErrorOutline32 />}
              title='Liquidation Price'
              value={liquidationPriceDisplay}
              unit='Hue/TruEth'
              changeData={
                previousLiquidationPrice !== null
                ? {
                  previous: previousLiquidationPrice,
                  next: liquidationPrice,
                  increaseIsGood: false,
                } : undefined
              }
            />
            <PositionInfoItem
              key='price_info'
              icon={<Tag32 />}
              title='Current Price'
              value={ethPriceDisplay}
              unit='Hue/TruEth'
            />
            <PositionInfoItem
              icon={<Locked32 />}
              title='Collateral Ratio'
              value={collateralizationDisplay}
              color={collateralColor}
              changeData={
                previousCollateralization === null ||
                collateralization === null
                ? undefined
                : {
                  previous: previousCollateralization * 100,
                  next: collateralization * 100,
                  increaseIsGood: true,
                  showChangeWithUnit: '%'
                }
              }
            />
            <PositionInfoItem
              key='apr_info'
              icon={<Calculation32 />}
              title='Current Borrow APR'
              value={interestRateDisplay + '%'}
            />
          </SpacedList>
          {
            nonSilentFailures.length > 0
            ? <InlineNotification
                notificationType='inline'
                kind='error'
                title={nonSilentFailures[0].message}
                lowContrast
                hideCloseButton
              />
            : null
          }
          {
            successDisplay !== null
            && Object.values(failures).filter(failure => failure.failing).length === 0
            ? <InlineNotification
                key='success_indicator'
                notificationType='inline'
                kind='success'
                title={successDisplay}
                lowContrast
                hideCloseButton
              />
            : null
          }
          {
            isCreating
            ? (
              onboarding.approvingEth
              ? <SpacedList spacing={20}>
                  <ActionSteps
                    action='creating a position'
                    disabled={isFailing}
                    steps={[
                      {
                        txArgs: approveEthTxArgs,
                        title: approveEthTitle,
                        buttonTitle: 'Approve',
                        complete: ethApproved,
                      },{
                        txArgs: createPositionArgs,
                        title: 'Create Position',
                        buttonTitle: 'Confirm',
                      }
                    ]}
                  />
                  {cancelCreateButton}
                </SpacedList>
              : <SpacedList row spacing={20}>
                  {createPositionButton}
                  {cancelCreateButton}
                </SpacedList>
            ) : (
              isEditing
              ? (
                isDebtDecrease && onboarding.approvingHue
                ?
                  <SpacedList spacing={20}>
                    <ActionSteps
                      disabled={isFailing}
                      action='paying back hue'
                      steps={[
                        {
                          txArgs: approveHueTxArgs,
                          title: 'Approve Hue',
                          buttonTitle: 'Approve',
                          complete: hueApproved,
                        },{
                          txArgs: updatePositionArgs,
                          title: 'Update Position',
                          buttonTitle: 'Confirm',
                        }
                      ]}
                    />
                    {getMultiButtonDisplay([cancelUpdateButton], true)}
                  </SpacedList>
                : getMultiButtonDisplay([updatePositionButton, cancelUpdateButton], true)
              ) : null
            )
          }
        </SpacedList>
      </Tile>
      {
        isCreating
        ? null
        : <div style={{marginTop: 20}}>
            <ClaimRewardsButton
              txArgs={{
                type: TransactionType.ClaimAllPositionRewards,
                positionIDs: position === null ? [] : [position.id],
                Market: contracts === null ? '' : contracts.Market
              }}
              count={position === null ? 0 : position.approximateRewards}
              disabled={position === null || contracts === null}
              walletToken={WalletToken.Tcp}
            />
          </div>
      }
    </>

  return (
    <OneColumnDisplay
      columnOne={columnOne}
      loading={userAddress !== null && dataNull}
    />
  )
}

export default ManagePosition
