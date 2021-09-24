import { useState } from "react"
import { Row, Col } from 'react-flexbox-grid'
import {
  Button,
  NumberInput,
  TextAreaSkeleton,
} from 'carbon-components-react'
import Text from '../utils/Text'
import LargeText from '../utils/LargeText'
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import { waitForHueBalance, waitForEthBalance, waitForMarket, waitForPrices } from '../../slices/waitFor'
import { onNumChange, numDisplay }  from '../../utils/'
import CreatePositionController from '../Write/CreatePositionController'



const PositionMetadata = ({items}: { items: {value: string, title: string }[]}) => {
  const border = '2px solid #161616'

  const valuesView = items.map((item, index) => {
    return (
      <Col xs key={"PositionMetadata " + index}>
        <div>
          <Text monospace size={14} lineHeight="18px" color="#8D8D8D" bold>{item.value}</Text>
        </div>
        <div>
          <Text monospace size={14} lineHeight="18px" color="#8D8D8D">{item.title}</Text>
        </div>
      </Col>
    )
  })

  return (
    <Row style={{
      borderTop: border,
      borderBottom: border,
      paddingTop: 16,
      paddingBottom: 12,
      paddingLeft: 12,
      paddingRight: 12,
    }}>
      {valuesView}
    </Row>
  )
}

const CreatePosition = () => {
  const dispatch = useAppDispatch()

  const hueBalance = waitForHueBalance(selector, dispatch)
  const priceInfo = waitForPrices(selector, dispatch)
  const userEthBalance = waitForEthBalance(selector, dispatch)
  const market = waitForMarket(selector, dispatch)
  const userAddress = selector(state => state.wallet.address)

  const [collateralCount, setCollateralCount] = useState(0)
  const [debtCount, setDebtCount] = useState(0.0)
  const [showCreatePosition, setShowCreatePosition] = useState(false)

  if (
    hueBalance === null ||
    priceInfo === null ||
    market === null ||
    userEthBalance === null ||
    userAddress === null
  ) return <TextAreaSkeleton />

  const ethPrice = 10
  const liquidationPrice = 20

  return (
    <>
      <LargeText>
        I want to create a position with
        <div style={{display: 'inline-block', width: 167}} >
          <NumberInput
            hideSteppers
            id="collateralInput"
            invalidText="Number is not valid"
            size="sm"
            min={0}
            onChange={onNumChange((value: number) => setCollateralCount(value))}
            value={0}
            style={{marginLeft: 8, marginRight: 8, paddingLeft: 10, paddingRight: 0}}
          />
        </div>
        Eth of Collateral and
        <div style={{display: 'inline-block', width: 167}} >
          <NumberInput
            hideSteppers
            id="debtInput"
            invalidText="Number is not valid"
            min={0}
            step={1e-6}
            size="sm"
            onChange={onNumChange((value: number) => setDebtCount(value))}
            value={0}
            style={{marginLeft: 8, marginRight: 8, paddingLeft: 10, paddingRight: 0}}
          />
        </div>

        Hue of debt.
      </LargeText>

      <div style={{marginTop: 36, marginBottom: 30}}>
        <PositionMetadata  items={[
          {
            title: 'Min position size',
            value: numDisplay(market.minPositionSize) + ' Hue',
          },{
            title: 'Collateralization Ratio',
            value: '153%'
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
        Eth is currently {numDisplay(priceInfo.ethPrice, 2)} Hue.
        If the price of Eth falls below 2712 Hue/Eth I could lose 13% of my Eth to liquidators.
      </LargeText>
      <div style={{marginTop: 32}}>
        <Button onClick={() => setShowCreatePosition(true)}>
          Create Position
        </Button>
      </div>
      <CreatePositionController
        collateralCount={collateralCount}
        debtCount={debtCount}
        ethPrice={ethPrice}
        liquidationPrice={liquidationPrice}
        onCancel={() => setShowCreatePosition(false)}
        isActive={showCreatePosition}
      />
    </>
  )
}

export default CreatePosition
