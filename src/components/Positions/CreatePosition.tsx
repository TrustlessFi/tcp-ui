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

const CreatePosition = () => {
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

export default CreatePosition
