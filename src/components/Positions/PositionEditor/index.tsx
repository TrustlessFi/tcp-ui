import { useState } from "react"
import {
  Button,
  NumberInput,
  TextAreaSkeleton,
} from 'carbon-components-react'
import { useAppDispatch, useAppSelector as selector } from '../../../app/hooks'
import { waitForPositions, waitForGovernor, waitForLiquidations, waitForRates, waitForPrices, waitForMarket } from '../../../slices/waitFor'
import SimpleTable from '../../library/SimpleTable'
import { editorClosed } from '../../../slices/positionsEditor'
import { roundToXDecimals } from '../../../utils'
import { onNumChange, anyNull }  from '../../../utils/'
import CreatePositionController from '../../Write/CreatePositionController'

export default ({}) => {
  const dispatch = useAppDispatch()
  const editorStatus = selector(state => state.positionsEditor.status)

  const page = editorStatus.creating
    ? <CreatePositionPage />
    : <UpdatePositionPage id={editorStatus.positionID} />

  return (
    <>
      <div>
        <Button onClick={() => dispatch(editorClosed())}>Go Back</Button>
      </div>
      {page}
    </>
  )
}

const CreatePositionPage = () => {
  const dispatch = useAppDispatch()

  const market = waitForMarket(selector, dispatch)
  const userAddress = selector(state => state.wallet.address)

  const [collateralCount, setCollateralCount] = useState(0)
  const [debtCount, setDebtCount] = useState(0)
  const [showCreatePosition, setShowCreatePosition] = useState(false)

  if (anyNull([market, userAddress])) return <TextAreaSkeleton />

  const ethPrice = 10
  const liquidationPrice = 20

  const createPositionController = (
    <CreatePositionController
      collateralCount={collateralCount}
      debtCount={debtCount}
      ethPrice={ethPrice}
      liquidationPrice={liquidationPrice}
      onCancel={() => setShowCreatePosition(false)}
      isActive={showCreatePosition}
    />
  )

  return (
    <>
      I want to create a position with
      <NumberInput
        id="tj-input"
        invalidText="Number is not valid"
        min={0}
        step={1}
        onChange={onNumChange((value: number) => setCollateralCount(value))}
        value={0}
      />


      Eth of Collateral and borrow
      <NumberInput
        id="tj-input"
        invalidText="Number is not valid"
        hideSteppers
        min={0}
        step={1}
        onChange={onNumChange((value: number) => setDebtCount(value))}
        value={0}
      />
      Hue.

      Eth is currently 3,100 Hue. If the price of Eth falls below 2712 Hue/Eth I will lose approximately 13% of my Eth to liquidators.
      <div>
        <Button onClick={() => setShowCreatePosition(true)}>
          Create Position
        </Button>
      </div>
      {createPositionController}
    </>
  )
}

const UpdatePositionPage = ({id}: { id: number}) => {
  const dispatch = useAppDispatch()

  const positions = waitForPositions(selector, dispatch)
  const governor = waitForGovernor(selector, dispatch)
  const liquidations = waitForLiquidations(selector, dispatch)
  const market = waitForMarket(selector, dispatch)
  const rates = waitForRates(selector, dispatch)
  const prices = waitForPrices(selector, dispatch)

  // const [collateralIncrease, setCollateralIncrease] = useState(0)
  // const [debtIncrease, setDebtIncrease] = useState(0)

  if (anyNull([governor, market, liquidations, rates, prices])) {
    return <>loading spinner</>
  }

  if (positions === null || !(positions.hasOwnProperty(id))) {
    throw new Error('Position ' + id + ' not found.')
  }

  const position = positions[id]

  const rows = [{
    key: position.id,
    data: {
      'Position ID': position.id,
      'Debt': position.debtCount + ' Hue',
      'Collateral': roundToXDecimals(position.collateralCount, 2) + ' Eth',
      'Current Eth/Hue price': roundToXDecimals(prices!.ethPrice, 2),
    },
  }]

  const table1 = <SimpleTable rows={rows} />

  const interestRate = rates!.interestRateAbsoluteValue * (rates!.positiveInterestRate ? 1 : -1)
  const liquidationIncentive = liquidations!.liquidationIncentive + liquidations!.discoveryIncentive - 1

  const liquidationPrice = (market!.collateralizationRequirement / position.collateralCount) * position.debtCount

  const rows2 = [{
    key: position.id,
    data: {
      'Min Position size': market!.minPositionSize,
      'Stability fee': (interestRate * 100) + '%',
      'Liquidation Fee': roundToXDecimals(liquidationIncentive * 100, 2) + '%',
      'Min Collateralization ratio': (market!.collateralizationRequirement * 100) + ' %',
      'Liquidation price': roundToXDecimals(liquidationPrice, 2),
    },
  }]

  const table2 = <SimpleTable rows={rows2} />

  return <>{table1}{table2}</>
}
