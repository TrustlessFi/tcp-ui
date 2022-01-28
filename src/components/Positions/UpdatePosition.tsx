import { useState, useEffect } from "react"
import { useHistory } from 'react-router-dom'
import {
  Tag32,
  Locked32,
  ErrorOutline32,
  Close32,
} from '@carbon/icons-react';
import FullNumberInput from '../library/FullNumberInput'
import PositionInfoItem from '../library/PositionInfoItem'
import Center from '../library/Center'
import Bold from '../library/Bold'
import ConnectWalletButton from '../library/ConnectWalletButton'
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import { useParams } from 'react-router-dom'
import waitFor from '../../slices/waitFor'
import { Position } from '../../slices/positions'
import { numDisplay, roundToXDecimals, isZeroish, lastOrNull } from '../../utils/'
import { reason } from '../library/ErrorMessage'
import SpacedList from '../library/SpacedList'
import { TransactionType } from '../../slices/transactions'
import CreateTransactionButton from '../library/CreateTransactionButton'
import Text from '../library/Text'
import OneColumnDisplay from '../library/OneColumnDisplay'
import ParagraphDivider from '../library/ParagraphDivider'
import { Accordion, AccordionItem, InlineNotification, Dropdown, OnChangeData } from 'carbon-components-react'
import { getCollateralRatioColor } from './'

const notionURL = 'https://trustlessfi.notion.site/Trustless-4be753d947b040a89a46998eca90b2c9'

interface MatchParams {
  positionID: string
}

const UpdatePosition = () => {
  const params: MatchParams = useParams()
  const dispatch = useAppDispatch()
  const history = useHistory()

  const positionID = Number(params.positionID)

  const {
    liquidationsInfo,
    balances,
    pricesInfo,
    marketInfo,
    ratesInfo,
    contracts,
    positions,
    userAddress,
  } = waitFor([
    'liquidationsInfo',
    'balances',
    'pricesInfo',
    'marketInfo',
    'ratesInfo',
    'contracts',
    'positions',
    'userAddress',
  ], selector, dispatch)

  const defaultCollateralizationRatio = 2.5
  const [collateralCount, setCollateralCount] = useState(0)
  const [debtCount, setDebtCount] = useState(0)
  const [debtIsFocused, setDebtIsFocused] = useState(false)
  const [collateralIsFocused, setCollateralIsFocused] = useState(false)

  const dataNull =
    liquidationsInfo === null ||
    balances === null ||
    pricesInfo === null ||
    marketInfo === null ||
    ratesInfo === null ||
    contracts === null ||
    positions === null ||
    userAddress === null



  let position =
    positions === null
    ? null
    : (isZeroish(positionID)
        ? lastOrNull(Object.values(positions)) as Position
        : (positions[positionID] === undefined ? null : positions[positionID] as Position))

  const areMultiplePositions = positions === null ? false : Object.values(positions).length > 1


  useEffect(() => {
    console.log({positions})
    if (positions === null) return
    if (position === null) {
      history.push('/positions/new')
    } else if (positionID === undefined) {
      history.push(`/positions/${position.id}`)
    } else {
      setCollateralCount(position.collateralCount)
      updateDebtCountImpl(position.debtCount)
    }
  }, [positions, position])

  if (userAddress === null) {
    return <Center><ConnectWalletButton /></Center>
  }

  const collateralIncrease = position === null ? null : collateralCount - position.collateralCount
  const debtIncrease = position === null ? null : debtCount - position.debtCount
  const isCollateralChanged = collateralIncrease !== null && Math.abs(collateralIncrease) > 0.001
  const isDebtChanged = debtIncrease !== null && Math.abs(debtIncrease) > 0.1
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
  const interestRateDisplay = dataNull ? '-%' : numDisplay(interestRate, 2) + '%'

  const ethPrice = pricesInfo === null ? null : pricesInfo.ethPrice
  const ethPriceDisplay = ethPrice === null ? '-' : numDisplay(ethPrice, 0)

  const txCostBuffer = 0.05

  const hueApproved =
    balances !== null &&
    contracts !== null &&
    balances.tokens[contracts.Hue].approval.Market !== undefined &&
    balances.tokens[contracts.Hue].approval.Market.approved

  const setCollateralCountToMax = () => {
    if (position !== null && balances !== null && balances.userEthBalance > txCostBuffer) {
      updateCollateralCount((balances.userEthBalance + position.collateralCount) - txCostBuffer)
    }
  }

  const setDebtToHighCollateralRatio = () => {
    setDebtCountToHighCollateralRatioImpl(collateralCount)
  }

  const updateCollateralCount = (countCollateral: number) => {
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
    setDebtCount(parseFloat(roundToXDecimals(countDebt, 2, true)))
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
      message: `Position has less than ${marketInfo === null ? '-' : numDisplay(marketInfo.minPositionSize)} Hue.`,
      failing: debtIsFocused || marketInfo === null ? false : 0 < debtCount && debtCount < marketInfo.minPositionSize,
    },
    insufficientEthInWallet: {
      message: 'Not enough Eth in wallet.',
      failing: balances === null || collateralIncrease === null ? false : balances.userEthBalance < collateralIncrease,
    },
    insufficientHueInWallet: {
      message: 'Connected wallet does not have enough Hue.',
      failing:
        debtIsFocused ||
        balances === null ||
        contracts === null ||
        debtIncrease === null
        ? false
        : balances.tokens[contracts.Hue].userBalance + debtIncrease < 0,
    },
    undercollateralized: {
      message: 'Position has a collateralization less than ' + numDisplay(marketInfo === null ? 0 : marketInfo.collateralizationRequirement * 100) + '%.',
      failing:
        collateralIsFocused ||
        debtIsFocused ||
        marketInfo === null ||
        collateralization === null
        ? false
        : debtCount !== 0 && collateralization < marketInfo.collateralizationRequirement,
    },
  }

  const failureReasons: reason[] = Object.values(failures)
  const isFailing = failureReasons.filter(reason => reason.failing).length > 0 || dataNull

  const collateralColor =
    collateralizationRequirement !== null && collateralization !== null && !isZeroish(collateralization)
    ? getCollateralRatioColor(collateralization, collateralizationRequirement)
    : undefined

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
    <SpacedList spacing={64} style={{display: 'relative'}}>
      {
        areMultiplePositions && positions !== null
        ? <Dropdown
            ariaLabel="Dropdown position ID selector"
            id='dropdown'
            items={Object.values(positions).map((position: Position) => position.id)}
            onChange={(data: OnChangeData<number>) => {
              const positionID = data.selectedItem
              if (positions === null || positionID === null || positionID === undefined) return
              const path = `/positions/${positionID}`
              history.push(path)
              // window.location.reload()
            }}
            itemToString={(itemID: number) => `Position ${itemID}`}
            initialSelectedItem={positionID}
            label='Select Position'
            titleText={<></>}
            // style={undefined}
          />
        : null
      }
      <div>
        <Center>
          <Text size={36}>
            Update Position {position === null ? '' : position.id}
          </Text>
        </Center>
      </div>
      <FullNumberInput
        title='Collateral'
        action={updateCollateralCount}
        value={collateralCount}
        unit='Eth'
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
              {balances === null ? '-' : roundToXDecimals(balances.userEthBalance, 4, true)}
            </Bold>
            {' '}
            Eth in your wallet
          </Text>
        }
      />
      <FullNumberInput
        title='Debt'
        action={updateDebtCount}
        value={debtCount}
        unit='Hue'
        defaultButton={{
          title: `${defaultCollateralizationRatio * 100}%`,
          action: setDebtToHighCollateralRatio,
        }}
        onFocusUpdate={setDebtIsFocused}
        subTitle={
          <Text>
            The interest rate is
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
            .map((failure, index) =>
              <InlineNotification
                key={index}
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
      </SpacedList>
      <Center>
        {
          isDebtDecrease && !hueApproved
          ? <CreateTransactionButton
              title={"Approve Payback"}
              disabled={debtIncrease >= 0 || balances === null || contracts === null || balances.tokens[contracts.Hue].approval.Market.approved}
              showDisabledInsteadOfConnectWallet={true}
              txArgs={{
                type: TransactionType.ApproveHue,
                Hue: contracts === null ? '' : contracts.Hue,
                spenderAddress: contracts === null ? '' : contracts.Market,
              }}
            />
          : <CreateTransactionButton
              title='Confirm'
              disabled={isFailing}
              txArgs={{
                type: TransactionType.UpdatePosition,
                positionID,
                collateralIncrease: position !== null && isCollateralChanged ? collateralCount - position.collateralCount : 0,
                debtIncrease: position !== null && isDebtChanged ? debtCount - position.debtCount: 0,
                Market: contracts === null ? '' : contracts.Market,
              }}
            />
        }
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
            Holding a position earns you TCP tokens propostional to the position's contribution to the protocol's overall debt.{' '}
            Learn more about borrowing <a href={notionURL} target='_blank'>here</a>.
        </AccordionItem>
      </Accordion>
    </SpacedList>

  return (
    <OneColumnDisplay
      columnOne={columnOne}
      loading={userAddress !== null && dataNull}
      breadCrumbItems={[{ text: 'Positions', href: '/' }, positionID.toString()]}
    />
  )
}

export default UpdatePosition
