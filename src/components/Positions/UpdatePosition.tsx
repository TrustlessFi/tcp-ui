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
import { numDisplay, zeroIfNaN } from '../../utils/index'
import { reason } from '../library/ErrorMessage'
import { TransactionType } from '../../slices/transactions'
import { clearPositions } from '../../slices/positions'
import { editorClosed } from '../../slices/positionsEditor'
import PositionNumberInput from '../library/PositionNumberInput'
import LargeText from '../utils/LargeText'
import PositionMetadata from '../library/PositionMetadata'
import Bold from '../utils/Bold'
import ErrorMessage from '../library/ErrorMessage'
import InputPicker from '../Lend/library/InputPicker'
import ApprovalButton from '../utils/ApprovalButton'

enum CollateralChange {
  Increase = 'Increase',
  Decrease = 'Decrease',
}

enum DebtChange {
  Borrow = 'Borrow',
  Payback = 'Payback',
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
  const positions = waitForPositions(selector, dispatch)

  const userAddress = selector(state => state.wallet.address)

  const resetPositions = () => {
    dispatch(clearPositions())
    dispatch(editorClosed())
  }

  if (userAddress === null) resetPositions()

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

  if (position === undefined) resetPositions()

  const debtIncrease = zeroIfNaN(increaseDebt ? debtCount : -debtCount)
  const collateralIncrease = zeroIfNaN(increaseCollateral ? collateralCount : -collateralCount)

  const newDebtCount = (position.debtCount + debtIncrease) < 0 ? 0 : position.debtCount + debtIncrease
  const newCollateralCount = position.collateralCount + collateralIncrease

  const collateralization = newDebtCount === 0 ? 0 : (newCollateralCount * priceInfo.ethPrice) / newDebtCount
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
    negativeCollateral: {
      message: 'Position does not have enough Eth.',
      failing: newCollateralCount < 0,
    },
    insufficientEthInWallet: {
      message: 'Connected wallet does not have enough Eth.',
      failing: userEthBalance - collateralIncrease < 0,
    },
    insufficientHueInWallet: {
      message: 'Connected wallet does not have enough Hue.',
      failing: hueBalance.userBalance + debtIncrease < 0,
    },
    undercollateralized: {
      message: 'Position has a collateralization less than ' + numDisplay(market.collateralizationRequirement * 100) + '%.',
      failing: newDebtCount !== 0 && collateralization < market.collateralizationRequirement,
    },
    paybackNotApproved: {
      message: 'Paying back Hue is not approved.',
      failing: debtIncrease < 0 && (hueBalance.approval.Market === undefined || !hueBalance.approval.Market.approved),
    },
  }

  const failureReasons: reason[] = Object.values(failures)
  const isFailing = failureReasons.filter(reason => reason.failing).length > 0

  const openUpdatePositionDialog = () => {
    dispatch(openModal({
      args: {
        type: TransactionType.UpdatePosition,
        positionID: id,
        debtIncrease,
        collateralIncrease,
        Market: marketContract,
      },
      collateralization,
      minCollateralization: market.collateralizationRequirement,
      ethPrice: priceInfo.ethPrice,
      liquidationPrice,
    }))
  }

  return (
    <>
      <LargeText>
        Position #{id} has {numDisplay(position.collateralCount, 2)} Eth of Collateral
        and {numDisplay(position.debtCount, 2)} Hue of debt.
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
        Eth and
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
            title: 'Position Collateral',
            value: numDisplay(newCollateralCount, 2) + ' Eth',
            failing: failures.negativeCollateral.failing,
          },{
            title: 'Position Debt',
            value: numDisplay(newDebtCount < 0 ? 0 : newDebtCount, 2) + ' Hue',
          },{
            title: 'Min position Debt',
            value: numDisplay(market.minPositionSize) + ' Hue',
            failing: failures.notBigEnough.failing,
          },{
            title: 'Collateralization Ratio',
            value: collateralizationDisplay,
            failing: failures.undercollateralized.failing,
          },{
            title: 'Wallet Eth Balance',
            value: numDisplay(userEthBalance - collateralIncrease, 2) + ' Eth',
            failing: failures.insufficientEthInWallet.failing,
          },{
            title: 'Wallet Hue Balance',
            value: numDisplay(hueBalance.userBalance + debtIncrease, 2) + ' Hue',
            failing: failures.insufficientHueInWallet.failing,
          },{
            title: 'Interest Rate',
            value: numDisplay(interestRate, 2) + '%',
          },
        ]} />
      </div>
      <LargeText>
        Eth is currently <Bold>{numDisplay(priceInfo.ethPrice, 0)}</Bold> Hue.
        If the price of Eth falls below <Bold>{liquidationPriceDisplay}</Bold> Hue
        I could lose <Bold>{numDisplay(totalLiquidationIncentive, 0)}%</Bold> or more of my position value in Eth to liquidators.
      </LargeText>
      <div style={{marginTop: 32}}>
        <ApprovalButton
          disabled={debtIncrease >= 0}
          token={ProtocolContract.Hue}
          protocolContract={ProtocolContract.Market}
          approvalLabels={{waiting: 'Approve Payback', approving: 'Approving Payback...', approved: 'Payback Approved'}}
        />
      </div>
      <div style={{marginTop: 32, marginBottom: 32}}>
        <Button onClick={openUpdatePositionDialog} disabled={isFailing}>
          Update Position
        </Button>
      </div>
      <ErrorMessage reasons={failureReasons} />
    </>
  )
}

export default UpdatePosition
