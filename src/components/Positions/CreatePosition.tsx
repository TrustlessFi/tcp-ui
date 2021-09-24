import { useState } from "react"
import { Row, Col } from 'react-flexbox-grid'
import {
  Button,
  NumberInput,
  TextAreaSkeleton,
} from 'carbon-components-react'
import LargeText from '../utils/LargeText'
import Bold from '../utils/Bold'
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import { waitForHueBalance, waitForEthBalance, waitForMarket, waitForPrices, waitForLiquidations } from '../../slices/waitFor'
import { onNumChange, numDisplay }  from '../../utils/'
import CreatePositionController from './CreatePositionController'
import PositionMetadata from './library/PositionMetadata'
import PositionNumberInput from './library/PositionNumberInput'
import ErrorMessage, { reason } from './library/ErrorMessage'

const CreatePosition = () => {
  const dispatch = useAppDispatch()

  const liquidations = waitForLiquidations(selector, dispatch)
  const hueBalance = waitForHueBalance(selector, dispatch)
  const priceInfo = waitForPrices(selector, dispatch)
  const userEthBalance = waitForEthBalance(selector, dispatch)
  const market = waitForMarket(selector, dispatch)
  const userAddress = selector(state => state.wallet.address)

  const [collateralCount, setCollateralCount] = useState(0)
  const [debtCount, setDebtCount] = useState(0.0)
  const [showCreatePosition, setShowCreatePosition] = useState(false)

  if (
    liquidations === null ||
    hueBalance === null ||
    priceInfo === null ||
    market === null ||
    userEthBalance === null ||
    userAddress === null
  ) return <TextAreaSkeleton />

  const collateralization = (collateralCount * priceInfo.ethPrice) / debtCount
  const collateralizationDisplay = numDisplay(collateralization * 100, 0) + '%'

  const liquidationPrice = (debtCount * market.collateralizationRequirement) / (collateralCount)
  const liquidationPriceDisplay = numDisplay(liquidationPrice, 0)

  const totalLiquidationIncentive = (liquidations.discoveryIncentive + liquidations.liquidationIncentive - 1) * 100

  const failures: {[key in string]: reason} = {
    noCollateral: {
      message: 'No collateral.',
      failing: collateralCount === 0 || isNaN(collateralCount),
      silent: true,
    },
    invalidDebt: {
      message: 'Invalid debt amount.',
      failing: isNaN(debtCount),
      silent: true,
    },
    notBigEnough: {
      message: 'Position has less than ' + numDisplay(market.minPositionSize) + ' Hue.' ,
      failing: 0 < debtCount &&  debtCount < market.minPositionSize,
    },
    undercollateralized: {
      message: 'Position has a collateralization less than ' + numDisplay(market.collateralizationRequirement * 100) + '%.',
      failing: collateralization < market.collateralizationRequirement,
    },
    insufficientEth: {
      message: 'Connected wallet does not have enough Eth.',
      failing: userEthBalance - collateralCount < 0,
    }
  }

  const failureReasons: reason[] = Object.values(failures)
  const isFailing = failureReasons.filter(reason => reason.failing).length > 0

  return (
    <>
      <LargeText>
        I want to create a position with
        <PositionNumberInput id="collateralInput" action={(value: number) => setCollateralCount(value)} />
        Eth of Collateral and
        <PositionNumberInput id="debtInput" action={(value: number) => setDebtCount(value)} />
        Hue of debt.
      </LargeText>

      <div style={{marginTop: 36, marginBottom: 30}}>
        <PositionMetadata  items={[
          {
            title: 'Min position size',
            value: numDisplay(market.minPositionSize) + ' Hue',
            failing: failures.notBigEnough.failing,
          },{
            title: 'Collateralization Ratio',
            value: collateralizationDisplay,
            failing: failures.undercollateralized.failing,
          },{
            title: 'New Eth Balance',
            value: numDisplay(userEthBalance - collateralCount),
            failing: failures.insufficientEth.failing,
          },{
            title: 'New Hue Balance',
            value: numDisplay(hueBalance.userBalance + debtCount)
          },
        ]} />
      </div>

      <LargeText>
        Eth is currently <Bold>{numDisplay(priceInfo.ethPrice, 0)}</Bold> Hue.
        If the price of Eth falls below <Bold>{liquidationPriceDisplay}</Bold> Hue
        I could lose <Bold>{numDisplay(totalLiquidationIncentive, 0)}%</Bold> or more of my position value in Eth to liquidators.
      </LargeText>
      <div style={{marginTop: 32, marginBottom: 32}}>
        <Button onClick={() => setShowCreatePosition(true)} disabled={isFailing}>
          Create Position
        </Button>
      </div>
      <ErrorMessage reasons={failureReasons} />
      <CreatePositionController
        collateralCount={collateralCount}
        debtCount={debtCount}
        ethPrice={priceInfo.ethPrice}
        liquidationPrice={liquidationPrice}
        onCancel={() => setShowCreatePosition(false)}
        isActive={showCreatePosition}
      />
    </>
  )
}

export default CreatePosition
