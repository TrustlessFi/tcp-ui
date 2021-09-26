import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import { useState } from "react"
import {
  waitForLiquidations,
  waitForRates,
  waitForPrices,
  waitForMarket,
  waitForHueBalance,
  waitForEthBalance,
  getContractWaitFunction,
  waitForPositions
} from '../../slices/waitFor'
import {
  TextAreaSkeleton,
  Button,
} from 'carbon-components-react'
import { ProtocolContract } from '../../slices/contracts'
import { openModal } from '../../slices/modal'
import { numDisplay, zeroIfNaN } from '../../utils/index';
import { reason } from './library/ErrorMessage';
import { TransactionType } from '../../slices/transactions/index';
import PositionNumberInput from './library/PositionNumberInput';
import LargeText from '../utils/LargeText';
import PositionMetadata from './library/PositionMetadata';
import Bold from '../utils/Bold';
import ErrorMessage from './library/ErrorMessage';
import InputPicker from '../Lend/library/InputPicker';

enum CollateralChange {
  Increase = 'Increase',
  Decrease = 'Decrease',
}

enum DebtChange {
  Payback = 'Payback',
  Borrow = 'Borrow',
}

const UpdatePosition = ({ id }: { id: number }) => {
  const dispatch = useAppDispatch()

  const [collateralCount, setCollateralCount] = useState(0)
  const [debtCount, setDebtCount] = useState(0)
  const initialCollateralChange = CollateralChange.Increase
  const initialDebtChange = DebtChange.Borrow
  const [collateralChange, setCollateralChange] = useState(initialCollateralChange)
  const [debtChange, setDebtChange] = useState(initialDebtChange)

  const liquidations = waitForLiquidations(selector, dispatch)
  const hueBalance = waitForHueBalance(selector, dispatch)
  const priceInfo = waitForPrices(selector, dispatch)
  const userEthBalance = waitForEthBalance(selector, dispatch)
  const market = waitForMarket(selector, dispatch)
  const rates = waitForRates(selector, dispatch)
  const marketContract = getContractWaitFunction(ProtocolContract.Market)(selector, dispatch)
  const userAddress = selector(state => state.wallet.address)
  const positions = waitForPositions(selector, dispatch)

  if (
    liquidations === null ||
    hueBalance === null ||
    priceInfo === null ||
    market === null ||
    rates === null ||
    marketContract === null ||
    userEthBalance === null ||
    userAddress === null ||
    positions === null
  ) return <TextAreaSkeleton />

  const position = positions[id]
  const increaseCollateral = collateralChange === CollateralChange.Increase
  const increaseDebt = debtChange === DebtChange.Borrow

  if (position === undefined) {
    throw new Error('PositionEditor: Position id not found: ' + id)
  }

  const debtIncrease = zeroIfNaN(increaseDebt ? debtCount : -debtCount)
  const collateralIncrease = zeroIfNaN(increaseCollateral ? collateralCount : -collateralCount)

  const newDebtCount = position.debtCount + debtIncrease
  const newCollateralCount = position.collateralCount + collateralIncrease

  const collateralization = (newCollateralCount * priceInfo.ethPrice) / newDebtCount
  const collateralizationDisplay = numDisplay(collateralization * 100, 0) + '%'

  const liquidationPrice = (newDebtCount * market.collateralizationRequirement) / (newCollateralCount)
  const liquidationPriceDisplay = numDisplay(liquidationPrice, 0)

  const totalLiquidationIncentive = (liquidations.discoveryIncentive + liquidations.liquidationIncentive - 1) * 100

  const interestRate = (rates.positiveInterestRate ? rates.interestRateAbsoluteValue : -rates.interestRateAbsoluteValue) * 100

  const failures: {[key in string]: reason} = {
    noChange: {
      message: 'No change.',
      failing: debtIncrease === 0 && collateralIncrease === 0,
      silent: true,
    },
    notBigEnough: {
      message: 'Position has less than ' + numDisplay(market.minPositionSize) + ' Hue.' ,
      failing: 0 < newDebtCount && newDebtCount < market.minPositionSize,
    },
    undercollateralized: {
      message: 'Position has a collateralization less than ' + numDisplay(market.collateralizationRequirement * 100) + '%.',
      failing: collateralization < market.collateralizationRequirement,
    },
    insufficientEth: {
      message: 'Connected wallet does not have enough Eth.',
      failing: userEthBalance - collateralIncrease < 0,
    }
  }

  const failureReasons: reason[] = Object.values(failures)
  const isFailing = failureReasons.filter(reason => reason.failing).length > 0

  const openCreatePositionDialog = () => {
    dispatch(openModal({
      args: {
        type: TransactionType.CreatePosition,
        collateralCount,
        debtCount,
        Market: marketContract,
      },
      ethPrice: priceInfo.ethPrice,
      liquidationPrice,
    }))
  }

  return (
    <>
      <LargeText>
        Position #{id} has {numDisplay(position.collateralCount, 2)} Eth of Collateral
        and {numDisplay(position.debtCount, 2)} Hue of debt
        with an interest rate of {numDisplay(interestRate, 2)}%.
        <div />
        I want to
        <InputPicker
          options={CollateralChange}
          initialValue={initialCollateralChange}
          onChange ={(option: CollateralChange) => setCollateralChange(option)}
        />
        collateral by
        <PositionNumberInput
          id="collateralInput"
          action={(value: number) => setCollateralCount(value)}
          value={collateralCount}
        />
        and
        <InputPicker
          options={DebtChange}
          initialValue={initialDebtChange}
          onChange ={(option: DebtChange) => setDebtChange(option)}
        />
        <PositionNumberInput
          id="debtInput"
          action={(value: number) => setDebtCount(value)}
          value={debtCount}
        />
        Hue.
      </LargeText>

      <div style={{marginTop: 36, marginBottom: 30}}>
        <PositionMetadata items={[
          {
            title: 'Min position size',
            value: numDisplay(market.minPositionSize) + ' Hue',
            failing: failures.notBigEnough.failing,
          },{
            title: 'Collateralization Ratio',
            value: collateralizationDisplay,
            failing: failures.undercollateralized.failing,
          },{
            title: 'New Wallet Eth Balance',
            value: numDisplay(userEthBalance - zeroIfNaN(collateralCount)),
            failing: failures.insufficientEth.failing,
          },{
            title: 'New Wallet Hue Balance',
            value: numDisplay(hueBalance.userBalance + zeroIfNaN(debtCount))
          },
        ]} />
      </div>
      <LargeText>
        Eth is currently <Bold>{numDisplay(priceInfo.ethPrice, 0)}</Bold> Hue.
        If the price of Eth falls below <Bold>{liquidationPriceDisplay}</Bold> Hue
        I could lose <Bold>{numDisplay(totalLiquidationIncentive, 0)}%</Bold> or more of my position value in Eth to liquidators.
      </LargeText>
      <div style={{marginTop: 32, marginBottom: 32}}>
        <Button onClick={openCreatePositionDialog} disabled={isFailing}>
          Create Position
        </Button>
      </div>
      <ErrorMessage reasons={failureReasons} />
    </>
  )
}

export default UpdatePosition
