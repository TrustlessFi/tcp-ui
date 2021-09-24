import { useState } from "react"
import { Row, Col } from 'react-flexbox-grid'
import {
  Button,
  NumberInput,
  TextAreaSkeleton,
} from 'carbon-components-react'
import LargeText from '../utils/LargeText'
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import { waitForHueBalance, waitForEthBalance, waitForMarket, waitForPrices, waitForLiquidations } from '../../slices/waitFor'
import { onNumChange, numDisplay }  from '../../utils/'
import CreatePositionController from '../Write/CreatePositionController'
import PositionMetadata from './library/PositionMetadata'
import PositionNumberInput from './library/PositionNumberInput'

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

  const collateralization = (collateralCount * priceInfo.ethPrice * 100) / debtCount
  const liquidationPrice = (debtCount * market.collateralizationRequirement) / (collateralCount)
  const liquidationPriceDisplay = numDisplay(liquidationPrice, 0)

  const totalLiquidationIncentive = (liquidations.discoveryIncentive + liquidations.liquidationIncentive - 1) * 100

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
          },{
            title: 'Collateralization Ratio',
            value: numDisplay(collateralization, 0) + '%'
          },{
            title: 'New Eth Balance',
            value: numDisplay(userEthBalance - collateralCount)
          },{
            title: 'New Hue Balance',
            value: numDisplay(hueBalance.userBalance + debtCount)
          },
        ]} />
      </div>

      <LargeText>
        Eth is currently {numDisplay(priceInfo.ethPrice, 0)} Hue.
        If the price of Eth falls below {liquidationPriceDisplay === '0' ? '-' : liquidationPriceDisplay} Hue
        I could lose {numDisplay(totalLiquidationIncentive, 0)}% or more of my position value in collateral to liquidators.
      </LargeText>
      <div style={{marginTop: 32}}>
        <Button onClick={() => setShowCreatePosition(true)}>
          Create Position
        </Button>
      </div>
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
