import { useState } from "react"
import {
  Button,
  NumberInput,
  TextAreaSkeleton,
} from 'carbon-components-react'
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import { waitForPositions, waitForGovernor, waitForLiquidations, waitForRates, waitForPrices, waitForMarket } from '../../slices/waitFor'
import SimpleTable from '../library/SimpleTable'
import { editorClosed } from '../../slices/positionsEditor'
import { roundToXDecimals } from '../../utils'
import { onNumChange, anyNull }  from '../../utils/'
import CreatePositionController from '../Write/CreatePositionController'

const UpdatePosition = ({id}: { id: number}) => {
  const dispatch = useAppDispatch()

  const governor = waitForGovernor(selector, dispatch)
  const liquidations = waitForLiquidations(selector, dispatch)
  const market = waitForMarket(selector, dispatch)
  const positions = waitForPositions(selector, dispatch)
  const prices = waitForPrices(selector, dispatch)
  const rates = waitForRates(selector, dispatch)

  // const [collateralIncrease, setCollateralIncrease] = useState(0)
  // const [debtIncrease, setDebtIncrease] = useState(0)

  console.log({governor, liquidations, market, positions, prices, rates})
 if (
    governor === null ||
    liquidations === null ||
    market === null ||
    positions === null ||
    prices === null ||
    rates === null
  ) {
    return <>loading spinner</>
  }

  if (positions === null || !(positions.hasOwnProperty(id))) {
    throw new Error('PositionEditor: Position id not found: ' + id)
  }

  const position = positions[id]

  const rows = [{
    key: position.id,
    data: {
      'Position ID': position.id,
      'Debt': position.debtCount + ' Hue',
      'Collateral': roundToXDecimals(position.collateralCount, 2) + ' Eth',
      'Current Eth/Hue price': roundToXDecimals(prices.ethPrice, 2),
    },
  }]

  const table1 = <SimpleTable rows={rows} />

  const interestRate = rates.interestRateAbsoluteValue * (rates.positiveInterestRate ? 1 : -1)
  const liquidationIncentive = liquidations.liquidationIncentive + liquidations.discoveryIncentive - 1

  const liquidationPrice = (market.collateralizationRequirement / position.collateralCount) * position.debtCount

  const rows2 = [{
    key: position.id,
    data: {
      'Min Position size': market.minPositionSize,
      'Stability fee': (interestRate * 100) + '%',
      'Liquidation Fee': roundToXDecimals(liquidationIncentive * 100, 2) + '%',
      'Min Collateralization ratio': (market.collateralizationRequirement * 100) + ' %',
      'Liquidation price': roundToXDecimals(liquidationPrice, 2),
    },
  }]

  const table2 = <SimpleTable rows={rows2} />

  return <>{table1}{table2}</>
}

export default UpdatePosition
