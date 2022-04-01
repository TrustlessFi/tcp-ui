import { useState, useEffect } from "react"
import { useHistory } from 'react-router-dom'
import { Tag32, Locked32, ErrorOutline32 } from '@carbon/icons-react';
import { red, orange, green, yellow } from '@carbon/colors';
import Center from '../library/Center'
import Bold from '../library/Bold'
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'

import waitFor from '../../slices/waitFor'
import { numDisplay, roundToXDecimals, isZeroish, last } from '../../utils/'
import PositionInfoItem from '../library/PositionInfoItem'
import reason from '../library/ErrorReasonType'
import SpacedList from '../library/SpacedList'
import FullNumberInput from '../library/FullNumberInput'
import { TransactionType } from '../../slices/transactions'
import CreateTransactionButton from '../library/CreateTransactionButton'
import Text from '../library/Text'
import OneColumnDisplay from '../library/OneColumnDisplay'
import ParagraphDivider from '../library/ParagraphDivider'
import { Accordion, AccordionItem, InlineNotification } from 'carbon-components-react'

const notionURL = 'https://trustlessfi.notion.site/Trustless-4be753d947b040a89a46998eca90b2c9'

const CreatePosition = () => {
  const dispatch = useAppDispatch()
  const history = useHistory()

  const {
    liquidationsInfo,
    balances,
    pricesInfo,
    positions,
    marketInfo,
    ratesInfo,
    contracts,
    userAddress,
  } = waitFor([
    'liquidationsInfo',
    'balances',
    'pricesInfo',
    'positions',
    'marketInfo',
    'ratesInfo',
    'contracts',
    'userAddress',
  ], selector, dispatch)

  const defaultCollateralizationRatio = 2.5
  const [collateralCount, setCollateralCount] = useState(0)
  const [debtCount, setDebtCount] = useState(0)
  const [userUpdatedDebtCount, setUserUpdatedDebtCount] = useState(false)
  const [debtIsFocused, setDebtIsFocused] = useState(false)
  const [collateralIsFocused, setCollateralIsFocused] = useState(false)

  useEffect(() => {
    if (positions === null) return
    if (Object.values(positions).length === 0) return
    history.push(`/borrow/${last(Object.keys(positions))}`)
    window.location.reload()
  }, [positions])

  const dataNull =
    liquidationsInfo === null ||
    balances === null ||
    pricesInfo === null ||
    marketInfo === null ||
    ratesInfo === null ||
    contracts === null

  const collateralization = dataNull ? null : (collateralCount * pricesInfo.ethPrice) / debtCount
  const collateralizationDisplay = collateralization === null ? '-%' : numDisplay(collateralization * 100, 0) + '%'

  const liquidationPrice = dataNull ? 0 : (debtCount * marketInfo.collateralizationRequirement) / (collateralCount)
  const liquidationPriceDisplay = dataNull ? '-' : numDisplay(liquidationPrice, 0)

  const collateralizationRequirement = marketInfo === null ? null : marketInfo.collateralizationRequirement

  const interestRate = dataNull ? 0 : ratesInfo.interestRate * 100
  const interestRateDisplay = dataNull ? '-%' : numDisplay(interestRate, 2) + '%'

  const ethPrice = pricesInfo === null ? null : pricesInfo.ethPrice
  const ethPriceDisplay = ethPrice === null ? '-' : numDisplay(ethPrice, 0)

  const txCostBuffer = 0.05

  const setCollateralCountToMax = () => {
    if (balances !== null && balances.userEthBalance > txCostBuffer) {
      updateCollateralCount(balances.userEthBalance - txCostBuffer)
    }
  }

  const setDebtToHighCollateralRatio = () => {
    setDebtCountToHighCollateralRatioImpl(collateralCount)
  }

  const updateCollateralCount = (countCollateral: number) => {
    setCollateralCount(parseFloat(roundToXDecimals(countCollateral, 4, true)))
    if (userUpdatedDebtCount) return

    setDebtCountToHighCollateralRatioImpl(countCollateral)
  }

  const updateDebtCount = (countDebt: number) => {
    setUserUpdatedDebtCount(true)
    updateDebtCountImpl(countDebt)
  }

  const setDebtCountToHighCollateralRatioImpl = (countCollateral: number) => {
    if (ethPrice === null) return
    updateDebtCountImpl((countCollateral * ethPrice) / defaultCollateralizationRatio)

  }

  const updateDebtCountImpl = (countDebt: number) => {
    setDebtCount(parseFloat(roundToXDecimals(countDebt, 2, true)))
  }

  const failures: { [key in string]: reason } = dataNull ? {} : {
    noCollateral: {
      message: 'No collateral.',
      failing: !collateralIsFocused && (collateralCount === 0 || isNaN(collateralCount)),
      silent: true,
    },
    invalidDebt: {
      message: 'Invalid debt amount.',
      failing: !debtIsFocused && isNaN(debtCount),
      silent: true,
    },
    notBigEnough: {
      message: 'Position has less than ' + numDisplay(marketInfo.minPositionSize) + ' Hue.',
      failing: !debtIsFocused && 0 < debtCount && debtCount < marketInfo.minPositionSize,
    },
    undercollateralized: {
      message: 'Position has a collateral ratio less than ' + numDisplay(marketInfo.collateralizationRequirement * 100) + '%.',
      failing:
        !debtIsFocused &&
        !collateralIsFocused &&
        collateralization !== null &&
        collateralization < marketInfo.collateralizationRequirement,
    },
    insufficientEth: {
      message: 'Connected wallet does not have enough Eth.',
      failing: collateralIsFocused || balances === null ? false : balances.userEthBalance - collateralCount < 0,
    }
  }

  const failureReasons: reason[] = Object.values(failures)
  const isFailing = failureReasons.filter(reason => reason.failing).length > 0

  let collateralColor: undefined | string = undefined
  if (collateralizationRequirement !== null && collateralization !== null && !isZeroish(collateralization)) {
    if (collateralization < collateralizationRequirement) collateralColor = red[50]
    else if (collateralization < collateralizationRequirement * 1.34) collateralColor = orange
    else if (collateralization < collateralizationRequirement * 1.66) collateralColor = yellow
    else collateralColor = green[50]
  }

  /*
      <div
        onClick={() => history.push('/')}
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          cursor: 'pointer',
        }}>
        <Close32 />
      </div>
  */

  const columnOne =
    <SpacedList spacing={64}>
      <Center>
        <Text size={36}>
          Borrow
        </Text>
      </Center>
      <FullNumberInput
        title='Collateral'
        action={updateCollateralCount}
        value={collateralCount}
        unit='Eth'
        onFocusUpdate={setCollateralIsFocused}
        defaultButton={{
          title: 'Max',
          action: setCollateralCountToMax
        }}
        subTitle={
          <Text>
            You have
            {' '}
            <Bold>
              {balances === null ? '-' : roundToXDecimals(balances.userEthBalance, 4, true)}
            </Bold>
            {' '}
            Eth in your wallet
          </Text>
        }
      />
      <FullNumberInput
        title='Borrow'
        action={updateDebtCount}
        value={debtCount}
        unit='Hue'
        onFocusUpdate={setDebtIsFocused}
        defaultButton={{
          title: `${defaultCollateralizationRatio * 100}%`,
          action: setDebtToHighCollateralRatio,
        }}
        subTitle={
          <Text>
            Current interest rate is
            {' '}
            <Bold>
              {interestRateDisplay}
            </Bold>
          </Text>
        }
      />
      <SpacedList spacing={16}>
        {
          Object.values(failures)
            .filter(failure => !failure.silent)
            .filter(failure => failure.failing)
            .map(failure =>
              <InlineNotification
                notificationType='inline'
                kind='error'
                title={failure.message}
                lowContrast
                hideCloseButton
              />
            )
        }
      </SpacedList>
      <SpacedList spacing={16}>
        <PositionInfoItem
          icon={<ErrorOutline32 />}
          title='Liquidation Price'
          value={liquidationPriceDisplay}
          unit='Hue/Eth'
        />
        <PositionInfoItem
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
        />
      </SpacedList>
      <Center>
        <CreateTransactionButton
          title='Confirm'
          disabled={isFailing}
          txArgs={{
            type: TransactionType.CreatePosition,
            collateralCount,
            debtCount,
            Market: contracts === null ? '' : contracts.Market,
          }}
        />
      </Center>
      <Accordion>
        <AccordionItem title="How does this work?">
            Creating a position means that you are depositing your Eth as collateral to borrow Hue.
            <ParagraphDivider />
            Hue can be traded for other assets on zkSync, or staked into the protocol to earn interest.{' '}
            As long as your position stays collateralized, you will always own the deposited Eth.{' '}
            The interest rate to borrow Hue can be positive or negative (it's possible to owe less than you borrowed).{' '}
            <ParagraphDivider />
            Positions can be adjusted anytime by increasing or decreasing the collateral, or repaying or borrowing more Hue.{' '}
            Holding a position earns you TCP tokens proportional to the position's contribution to the protocol's overall debt.{' '}
            Learn more about borrowing <a href={notionURL} target='_blank'>here</a>.
        </AccordionItem>
      </Accordion>
    </SpacedList>

  return (
    <OneColumnDisplay
      columnOne={columnOne}
      loading={userAddress !== null && dataNull}
      breadCrumbItems={[{ text: 'Positions', href: '/' }, 'New']}
    />
  )
}

export default CreatePosition
