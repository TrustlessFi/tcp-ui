import { useState } from "react"
import { useParams } from 'react-router';
import {
  waitForLiquidations,
  waitForRates,
  waitForPrices,
  waitForMarket,
  waitForHueBalance,
  waitForEthBalance,
  waitForContracts,
  waitForPositions
} from '../../slices/waitFor'
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import { numDisplay, zeroIfNaN } from '../../utils/index'
import { reason } from '../library/ErrorMessage'
import { TransactionType } from '../../slices/transactions'
import { clearPositions } from '../../slices/positions'
import { editorClosed } from '../../slices/positionsEditor'
import PositionNumberInput from '../library/PositionNumberInput'
import LargeText from '../utils/LargeText'
import Bold from '../utils/Bold'
import ErrorMessage from '../library/ErrorMessage'
import InputPicker from '../Lend/library/InputPicker'
import CreateTransactionButton from '../utils/CreateTransactionButton';
import { Row, Col } from 'react-flexbox-grid'
import PositionMetadata2 from '../library/PositionMetadata2'
import TwoColumnDisplay from '../utils/TwoColumnDisplay'
import ParagraphDivider from '../utils/ParagraphDivider'

enum CollateralChange {
  Increase = 'Increase',
  Decrease = 'Decrease',
}

enum DebtChange {
  Borrow = 'Borrow',
  Payback = 'Payback',
}

interface MatchParams {
  positionID: string
}

const UpdatePosition = () => {
  const params: MatchParams = useParams()
  const dispatch = useAppDispatch()

  const positionID = Number(params.positionID)

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
  const contracts = waitForContracts(selector, dispatch)
  const positions = waitForPositions(selector, dispatch)

  const userAddress = selector(state => state.wallet.address)

  const resetPositions = () => {
    dispatch(clearPositions())
    dispatch(editorClosed())
  }

  if (userAddress === null) resetPositions()

  const dataNull =
    liquidations === null ||
    hueBalance === null ||
    priceInfo === null ||
    userEthBalance === null ||
    market === null ||
    rates === null ||
    contracts === null ||
    positions === null ||
    userAddress === null

  const position = dataNull ? null : positions[positionID]
  const increaseCollateral = collateralChange === CollateralChange.Increase
  const increaseDebt = debtChange === DebtChange.Borrow

  if (position === undefined) resetPositions()

  const debtIncrease = zeroIfNaN(increaseDebt ? debtCount : -debtCount)
  const collateralIncrease = zeroIfNaN(increaseCollateral ? collateralCount : -collateralCount)

  const newDebtCount = position === null ? 0 : (position.debtCount + debtIncrease) < 0 ? 0 : position.debtCount + debtIncrease
  const newCollateralCount = position === null ? 0 : position.collateralCount + collateralIncrease

  const collateralization = priceInfo === null ? 0 : (newDebtCount === 0 ? 0 : (newCollateralCount * priceInfo.ethPrice) / newDebtCount)
  const collateralizationDisplay = numDisplay(collateralization * 100, 0) + '%'

  const liquidationPrice = market === null ? 0 :  (newDebtCount * market.collateralizationRequirement) / (newCollateralCount)
  const liquidationPriceDisplay = numDisplay(liquidationPrice, 0)

  const totalLiquidationIncentive = liquidations === null ? 0 : (liquidations.discoveryIncentive + liquidations.liquidationIncentive - 1) * 100

  // const interestRate = (rates.positiveInterestRate ? rates.interestRateAbsoluteValue : -rates.interestRateAbsoluteValue) * 100

  const failures: { [key in string]: reason } = {
    noChange: {
      message: 'No change.',
      failing: debtIncrease === 0 && collateralIncrease === 0,
      silent: true,
    },
    notBigEnough: {
      message: 'Position has less than ' + numDisplay(market === null ? 0 : market.minPositionSize) + ' Hue.',
      failing: market === null ? false : 0 < newDebtCount && newDebtCount < market.minPositionSize,
    },
    negativeCollateral: {
      message: 'Position does not have enough Eth.',
      failing: newCollateralCount < 0,
    },
    insufficientEthInWallet: {
      message: 'Connected wallet does not have enough Eth.',
      failing: userEthBalance === null ? false : userEthBalance - collateralIncrease < 0,
    },
    insufficientHueInWallet: {
      message: 'Connected wallet does not have enough Hue.',
      failing: hueBalance === null ? false : hueBalance.userBalance + debtIncrease < 0,
    },
    undercollateralized: {
      message: 'Position has a collateralization less than ' + numDisplay(market === null ? 0 : market.collateralizationRequirement * 100) + '%.',
      failing: market === null ? false : newDebtCount !== 0 && collateralization < market.collateralizationRequirement,
    },
    paybackNotApproved: {
      message: 'Paying back Hue is not approved.',
      failing: hueBalance === null ? false : debtIncrease < 0 && (hueBalance.approval.Market === undefined || !hueBalance.approval.Market.approved),
    },
  }

  const failureReasons: reason[] = Object.values(failures)
  const isFailing = failureReasons.filter(reason => reason.failing).length > 0

  const newDebtCountDisplay = numDisplay(newDebtCount < 0 ? 0 : newDebtCount, 2)

  const ethPriceDisplay = priceInfo === null ? '-' : numDisplay(priceInfo.ethPrice, 0)

  const metadataItems = [
    {
      title: 'Position Collateral',
      value: numDisplay(newCollateralCount, 2) + ' Eth',
      failing: failures.negativeCollateral.failing,
    }, {
      title: 'Position Debt',
      value: newDebtCountDisplay + ' Hue',
    }, {
      title: 'Hue/Eth Current Price',
      value: ethPriceDisplay,
      failing: false,
    }, {
      title: 'Hue/Eth Liquidation Price',
      value: liquidationPriceDisplay,
      failing: priceInfo === null  ? false : liquidationPrice >= priceInfo.ethPrice,
    }, {
      title: 'Collateralization Ratio',
      value: collateralizationDisplay,
      failing: market === null ? false : collateralization < market.collateralizationRequirement,
    },
  ]


  const columnOne =
    <>
      <Row bottom='xs' style={{ marginBottom: 8 }}>
        <Col>
          <InputPicker
            options={CollateralChange}
            initialValue={initialCollateralChange}
            onChange={(option: CollateralChange) => setCollateralChange(option)}
          />
        </Col>
        <Col>
          Eth collateral by
        </Col>
      </Row>
      <PositionNumberInput
        id="collateralInput"
        action={(value: number) => setCollateralCount(value)}
        value={collateralCount}
      />
      <Row bottom='xs' style={{ marginBottom: 8 }}>
        <Col>
          <InputPicker
            options={DebtChange}
            initialValue={initialDebtChange}
            onChange={(option: DebtChange) => setDebtChange(option)}
          />
        </Col>
        <Col>
          Hue
              </Col>
      </Row>
      <PositionNumberInput
        id="debtInput"
        action={(value: number) => setDebtCount(value)}
        value={debtCount}
      />
      <div style={{ marginTop: 36, marginBottom: 30 }}>
        <PositionMetadata2 items={metadataItems} />
      </div>
      <div style={{ marginTop: 32 }}>
        <CreateTransactionButton
          title={"Approve Payback"}
          disabled={debtIncrease >= 0 || hueBalance === null || hueBalance.approval.Market ?.approved}
          showDisabledInsteadOfConnectWallet={true}
          shouldOpenTxTab={false}
          txArgs={{
            type: TransactionType.ApproveHue,
            Hue: contracts === null ? '' : contracts.Hue,
            spenderAddress: contracts === null ? '' : contracts.Market,
          }}
        />
      </div>
      <div style={{ marginTop: 32, marginBottom: 32 }}>
        <CreateTransactionButton
          title="Update Position"
          disabled={isFailing}
          txArgs={{
            type: TransactionType.UpdatePosition,
            positionID,
            debtIncrease,
            collateralIncrease,
            Market: contracts === null ? '' : contracts.Market,
          }}
        />
      </div>
      <ErrorMessage reasons={failureReasons} />
    </>

  const columnTwo =
    <LargeText>

      Position #{positionID} currently has {position === null ? 0 : numDisplay(position.collateralCount, 2)} Eth of Collateral
            and {numDisplay(position === null ? 0 : position.debtCount, 2)} Hue of debt.

      <ParagraphDivider />

      You are going to {collateralChange.toLowerCase()} collateral
            by {numDisplay(collateralCount)} Eth for a new total
            of {numDisplay(newCollateralCount, 2)} Eth of collateral
            and {debtChange.toLowerCase()} {numDisplay(debtCount)} Hue for a new total
            of {newDebtCountDisplay} Hue debt in position #{positionID}.

      <ParagraphDivider />

      The price of Eth is currently {priceInfo === null ? 0 : numDisplay(priceInfo.ethPrice, 0)} Hue.
            If the price of Eth falls below <Bold>{liquidationPriceDisplay}</Bold> Hue
            you could lose <Bold>{numDisplay(totalLiquidationIncentive, 0)}%</Bold> or more of your position value in Eth to liquidators.

          </LargeText>
  return (
    <TwoColumnDisplay
      columnOne={columnOne}
      columnTwo={columnTwo}
      loading={userAddress !== null && dataNull}
      breadCrumbItems={[{ text: 'Positions', href: '/' }, 'New']}
    />
  )
}

export default UpdatePosition
