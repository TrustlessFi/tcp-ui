import { useState, useEffect, ReactFragment } from "react"
import {
  Tag32,
  Locked32,
  ErrorOutline32,
  Calculation32,
} from '@carbon/icons-react';
import FullNumberInput from '../library/FullNumberInput'
import PositionInfoItem from '../library/PositionInfoItem'
import Bold from '../library/Bold'
import LargeText from '../library/LargeText'
import Center from '../library/Center'
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import waitFor from '../../slices/waitFor'
import { Position } from '../../slices/positions'
import { numDisplay, roundToXDecimals, isZeroish, empty } from '../../utils/'
import { reason } from '../library/ErrorMessage'
import SpacedList from '../library/SpacedList'
import { TransactionType, TransactionStatus } from '../../slices/transactions'
import CreateTransactionButton from '../library/CreateTransactionButton'
import Text from '../library/Text'
import OneColumnDisplay from '../library/OneColumnDisplay'
import { InlineNotification, Button, Tile } from 'carbon-components-react'
import { getCollateralRatioColor } from './'

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
  ], selector, dispatch)

  const defaultCollateralizationRatio = 2.5
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

  useEffect(() => {
    if (positions !== null) {
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
          setCreating(false, position.collateralCount, position.debtCount)
        }
      }
    }
  }, [positions])

  console.log({positions})

  const position = positions === null || Object.values(positions).length === 0 ? null : Object.values(positions)[0]

  const collateralIncrease = collateralCount - (position === null ? 0 : position.collateralCount)
  const debtIncrease = parseFloat(roundToXDecimals(debtCount - (position === null ? 0 : position.debtCount), 2))
  const isCollateralChanged = Math.abs(collateralIncrease) > 0.001
  const isDebtChanged = Math.abs(debtIncrease) > 0.1
  const isDebtDecrease = isDebtChanged && debtIncrease < 0

  const collateralization = pricesInfo === null ? null : (collateralCount * pricesInfo.ethPrice) / debtCount
  const collateralizationDisplay = collateralization === null ? '-%' : numDisplay(collateralization * 100, 0) + '%'

  const previousCollateralization =
    pricesInfo === null || position === null
    ? null
    : (position.collateralCount * pricesInfo.ethPrice) / position.debtCount

  const liquidationPrice = marketInfo === null ? 0 : (debtCount * marketInfo.collateralizationRequirement) / (collateralCount)
  const liquidationPriceDisplay = dataNull ? '-' : numDisplay(liquidationPrice, 0)

  const previousLiquidationPrice =
    marketInfo === null
    || position === null
    ? null
    : (position.debtCount * marketInfo.collateralizationRequirement) / position.collateralCount

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

  const setCollateralCountToMax = () => {
    const userEthBalance =
      balances !== null && balances.userEthBalance > txCostBuffer
      ? balances.userEthBalance - txCostBuffer
      : 0
    const positionCollateral = position === null ? 0 : position.collateralCount

    updateCollateralCount(userEthBalance + positionCollateral)
  }

  const setDebtToHighCollateralRatio = () => {
    setDebtCountToHighCollateralRatioImpl(collateralCount)
  }

  const updateCollateralCount = (countCollateral: number) => {
    if (countCollateral !== 0) setDeleteSelected(false)
    setCollateralCount(parseFloat(roundToXDecimals(countCollateral, 4, true)))
  }

  const updateDebtCount = (countDebt: number) => {
    updateDebtCountImpl(countDebt)
  }

  const setDebtCountToHighCollateralRatioImpl = (countCollateral: number) => {
    if (ethPrice === null) return
    updateDebtCountImpl((countCollateral * ethPrice) / defaultCollateralizationRatio)
  }

  const updateDebtCountImpl = (countDebt: number) => {
    if (countDebt !== 0) setDeleteSelected(false)
    setDebtCount(parseFloat(roundToXDecimals(countDebt, 2, true)))
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
      updateDebtCountImpl(position!.debtCount)
      updateCollateralCount(position!.collateralCount)
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
      message: 'You don\'t have enough Eth in your wallet.',
      failing: balances === null || collateralIncrease === null ? false : balances.userEthBalance < collateralIncrease,
    },
    insufficientHueInWallet: {
      message: 'You don\'t have enough Hue in your wallet.',
      silent: debtIsFocused,
      failing:
        (balances === null ||
        contracts === null ||
        (isDebtChanged && balances.tokens[contracts.Hue].userBalance + debtIncrease < 0)),
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
      disabled={collateralIncrease === 0 && debtIncrease === 0}
      onClick={cancelCreate}
      kind='secondary'
      size='md'>
      Cancel
    </Button>

  const cancelUpdateButton =
    <Button
      onClick={cancelUpdate}
      kind='secondary'
      size='md'>
      Cancel
    </Button>

  const editButton =
    isEditing
    ? null
    : <Button
        onClick={() => setIsEditing(true)}
        size='sm'
        small
        kind='primary'>
        Edit
      </Button>

  const createPositionButton =
    position === null
    ? <CreateTransactionButton
        title='Confirm'
        disabled={isFailing}
        size='md'
        txArgs={{
          type: TransactionType.CreatePosition,
          collateralCount,
          debtCount,
          Market: contracts === null ? '' : contracts.Market,
        }}
      />
    : <CreateTransactionButton
        title='Confirm'
        disabled={isFailing}
        size='md'
        txArgs={{
          type: TransactionType.UpdatePosition,
          positionID: position === null ? 0 :  position.id,
          collateralIncrease: collateralCount,
          debtIncrease: debtCount,
          Market: contracts === null ? '' : contracts.Market,
        }}
      />

  const updatePositionButton =
    <CreateTransactionButton
      title='Confirm'
      disabled={isFailing}
      size='md'
      txArgs={{
        type: TransactionType.UpdatePosition,
        positionID: position === null ? 0 :  position.id,
        collateralIncrease: position !== null && isCollateralChanged ? collateralCount - position.collateralCount : 0,
        debtIncrease: position !== null && isDebtChanged ? (debtCount === 0 ? -(position.debtCount * 2) : debtCount - position.debtCount) : 0,
        Market: contracts === null ? '' : contracts.Market,
      }}
    />

  const approveHueButton =
    <CreateTransactionButton
      title='Approve'
      size='md'
      disabled={isFailing || debtIncrease >= 0 || balances === null || contracts === null || balances.tokens[contracts.Hue].approval.Market.approved}
      showDisabledInsteadOfConnectWallet={true}
      txArgs={{
        type: TransactionType.ApproveHue,
        Hue: contracts === null ? '' : contracts.Hue,
        spenderAddress: contracts === null ? '' : contracts.Market,
      }}
    />

  interface changeDisplay {amount: string, action: string}

  const debtChangeSuccessDisplay: null | changeDisplay =
    debtIncrease === 0
    ? null
    : (debtIncrease > 0
      ? {action: 'receive', amount: `${numDisplay(debtIncrease, 2)} Hue`}
      : {action: 'pay', amount: `${numDisplay(Math.abs(debtIncrease), 2)} Hue`})

  const collateralChangeSuccessDisplay: null | changeDisplay =
    collateralIncrease === 0
    ? null
    : (collateralIncrease > 0
      ? {action: 'deposit', amount: `${numDisplay(collateralIncrease, 4)} Eth`}
      : {action: 'receive', amount: `${numDisplay(Math.abs(collateralIncrease), 4)} Eth`})

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


  const columnOne =
    <Tile style={{padding: 40, marginTop: 40}}>
      <SpacedList spacing={40} style={{display: 'relative'}}>
        <div style={{display: 'float', alignItems: 'center'}}>
          <div style={{float: 'right'}}>
            <Center>
            {isCreating ? null : editButton}
            </Center>
          </div>
          {
            <LargeText size={24}>
              {isCreating ? 'Create Position' : 'Your Position'}
            </LargeText>
          }
        </div>
        <FullNumberInput
          key='collateral_input'
          title='Collateral'
          action={updateCollateralCount}
          value={collateralCount}
          unit='Eth'
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
                {balances === null ? '-' : numDisplay(balances.userEthBalance, 4)}
              </Bold>
              {' '}
              Eth in your wallet
            </Text>
          }
        />
        <FullNumberInput
          key='debt_input'
          title='Debt'
          action={updateDebtCount}
          value={debtCount}
          unit='Hue'
          light
          frozen={!isEditing || deleteSelected}
          defaultButton={{
            title: `${defaultCollateralizationRatio * 100}%`,
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
                  : numDisplay(balances.tokens[contracts.Hue].userBalance, 2)}
              </Bold>
              {' '}
              Hue in your wallet
            </Text>
          }
        />
        <SpacedList spacing={20}>
          <PositionInfoItem
            key='liquidation_info'
            icon={<ErrorOutline32 />}
            title='Liquidation Price'
            value={liquidationPriceDisplay}
            unit='Hue/Eth'
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
            unit='Hue/Eth'
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
            value={interestRateDisplay}
            unit='%'
          />
        </SpacedList>
        <SpacedList spacing={16}>
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
        </SpacedList>
        <div style={{display: 'flex'}}>
          <SpacedList
            row
            spacing={10}
            style={{float: 'left', width: '100%', marginRight: '1em', whiteSpace: 'nowrap'}}>
            {
              isCreating
              ? [createPositionButton, cancelCreateButton]
              : (
                  isEditing
                  ? (
                      isDebtDecrease && !hueApproved
                      ? [approveHueButton, cancelUpdateButton]
                      : [updatePositionButton, cancelUpdateButton]
                  ) : null
              )
            }
          </SpacedList>
          {
            isEditing
            && position !== null
            ? <div
                style={{float: 'right'}}>
                <Button
                  disabled={deleteSelected || (position.collateralCount === 0 && position.debtCount === 0)}
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
      </SpacedList>
    </Tile>

  return (
    <OneColumnDisplay
      columnOne={columnOne}
      loading={userAddress !== null && dataNull}
    />
  )
}

export default ManagePosition
