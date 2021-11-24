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
import {
  TextAreaSkeleton,
  Button,
} from 'carbon-components-react'
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import { ProtocolContract } from '../../slices/contracts'
import { numDisplay, zeroIfNaN } from '../../utils/index'
import { reason } from '../library/ErrorMessage'
import Breadcrumbs from '../library/Breadcrumbs'
import { TransactionType } from '../../slices/transactions'
import { clearPositions } from '../../slices/positions'
import { editorClosed } from '../../slices/positionsEditor'
import PositionNumberInput from '../library/PositionNumberInput'
import LargeText from '../utils/LargeText'
import Text from '../utils/Text'
import Bold from '../utils/Bold'
import ErrorMessage from '../library/ErrorMessage'
import InputPicker from '../Lend/library/InputPicker'
import CreateTransactionButton from '../utils/CreateTransactionButton';
import { Row, Col } from 'react-flexbox-grid'
import PositionMetadata2 from '../library/PositionMetadata2';

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

  if (
    liquidations === null ||
    hueBalance === null ||
    priceInfo === null ||
    market === null ||
    rates === null ||
    contracts === null ||
    userEthBalance === null ||
    userAddress === null ||
    positions === null
  ) return <TextAreaSkeleton />

  const position = positions[positionID]
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

  // const interestRate = (rates.positiveInterestRate ? rates.interestRateAbsoluteValue : -rates.interestRateAbsoluteValue) * 100

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

  const paragraphDivider = <div style={{height: 32}} />

  const newDebtCountDisplay = numDisplay(newDebtCount < 0 ? 0 : newDebtCount, 2)

  const ethPriceDisplay = priceInfo === null ? '-' : numDisplay(priceInfo.ethPrice, 0)

  return (
    <>
      <Breadcrumbs items={[{ text: 'Positions', href: '/' }, 'Update']} />
      <Row>
        <Col xs={4}>
          <Text>
            <div />
            <Row bottom='xs' style={{marginBottom: 8}}>
              <Col>
                <InputPicker
                  options={CollateralChange}
                  initialValue={initialCollateralChange}
                  onChange ={(option: CollateralChange) => setCollateralChange(option)}
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
            <Row bottom='xs' style={{marginBottom: 8}}>
              <Col>
                <InputPicker
                  options={DebtChange}
                  initialValue={initialDebtChange}
                  onChange ={(option: DebtChange) => setDebtChange(option)}
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
          </Text>
          <div style={{marginTop: 36, marginBottom: 30}}>
            <PositionMetadata2 items={[
              {
                title: 'Position Collateral',
                value: numDisplay(newCollateralCount, 2) + ' Eth',
                failing: failures.negativeCollateral.failing,
              },{
                title: 'Position Debt',
                value: newDebtCountDisplay + ' Hue',
              },{
                title: 'Hue/Eth Current Price',
                value: ethPriceDisplay,
                failing: false,
              },{
                title: 'Hue/Eth Liquidation Price',
                value: liquidationPriceDisplay,
                failing: liquidationPrice >= priceInfo.ethPrice,
              },{
                title: 'Collateralization Ratio',
                value: collateralizationDisplay,
                failing: collateralization < market.collateralizationRequirement,
              },
            ]} />
          </div>
          <div style={{marginTop: 32}}>
            <CreateTransactionButton
              title={"Approve Payback"}
              disabled={debtIncrease >= 0 || hueBalance.approval.Market?.approved}
              showDisabledInsteadOfConnectWallet={true}
              shouldOpenTxTab={false}
              txArgs={{
                type: TransactionType.ApproveHue,
                Hue: contracts!.Hue,
                spenderAddress: contracts!.Market,
              }}
            />
          </div>
          <div style={{marginTop: 32, marginBottom: 32}}>
            <CreateTransactionButton
              title="Update Position"
              disabled={isFailing}
              txArgs={{
                type: TransactionType.UpdatePosition,
                positionID,
                debtIncrease,
                collateralIncrease,
                Market: contracts!.Market,
              }}
            />
          </div>
          <ErrorMessage reasons={failureReasons} />
        </Col>
        <Col xs={8} style={{marginTop: 32}}>
          <LargeText>
            Position #{positionID} currently has {numDisplay(position.collateralCount, 2)} Eth of Collateral
            and {numDisplay(position.debtCount, 2)} Hue of debt.

            {paragraphDivider}

            You are going to {collateralChange.toLowerCase()} collateral
            by {numDisplay(collateralCount)} Eth for a new total
            of {numDisplay(newCollateralCount, 2)} Eth of collateral
            and {debtChange.toLowerCase()} {numDisplay(debtCount)} Hue for a new total
            of {newDebtCountDisplay} Hue debt in position #{positionID}.

            {paragraphDivider}

            The price of Eth is currently {numDisplay(priceInfo.ethPrice, 0)} Hue.
            If the price of Eth falls below <Bold>{liquidationPriceDisplay}</Bold> Hue
            you could lose <Bold>{numDisplay(totalLiquidationIncentive, 0)}%</Bold> or more of your position value in Eth to liquidators.

          </LargeText>
        </Col>
      </Row>
    </>
  )
}

export default UpdatePosition
