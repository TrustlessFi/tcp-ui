import { CSSProperties, ReactNode } from 'react';
import { Row, Col } from 'react-flexbox-grid'
import LargeText from '../library/LargeText'
import Bold from '../library/Bold'
import Text from '../library/Text'
import {
  ChevronUp16,
  ChevronDown16,
} from '@carbon/icons-react';
import { red, green } from '@carbon/colors';
import { xor, numDisplay } from '../../utils'

const PositionInfoItem = ({
  icon,
  title,
  value,
  unit,
  style,
  color,
  changeData,
}: {
  icon: ReactNode,
  title: string
  value: string | number
  unit?: string
  style?: CSSProperties
  color?: string
  changeData?: {
    previous: number
    next: number
    increaseIsGood: boolean
    showChangeWithUnit?: string
    changeThreshold?: number
  }
}) => {

  const getChangeDisplay = () => {
    if (changeData === undefined) return null
    const changeThreshold = changeData.changeThreshold === undefined ? 1e-3 : changeData.changeThreshold
    const hasChanged = Math.abs(changeData.next / changeData.previous - 1) > changeThreshold
    if (!hasChanged) return null

    const increaseAmount = changeData.next - changeData.previous
    const isIncrease = increaseAmount > 0
    const changeColor =
      xor(changeData.increaseIsGood, isIncrease)
      ? red[50]
      : green[50]
    const icon = isIncrease ? <ChevronUp16 color={changeColor} /> : <ChevronDown16 color={changeColor}/>
    const changeAmountDisplay =
      changeData.showChangeWithUnit === undefined
      ? null
      : `${numDisplay(increaseAmount, 0)} ${changeData.showChangeWithUnit}`

    return (
      <Col style={{marginLeft: '0.25em'}}>
        <Text color={changeColor}>
          ({icon}{changeAmountDisplay})
        </Text>
      </Col>
    )
  }

  return (
    <Row middle="xs" style={{marginLeft: 0, ...style}}>
      <Col style={{marginRight: '2em', marginLeft: 0}}>
        {icon}
      </Col>
      <Col>
        <Row>{title}</Row>
        <Row middle='xs'>
          <Col>
            <Bold>
              <LargeText color={color}>
                {value}
              </LargeText>
            </Bold>
          </Col>
          {
            unit !== undefined
            ? <Col style={{marginLeft: '0.25em'}}>
                <Text>
                  {unit}
                </Text>
              </Col>
            : null
          }
          {getChangeDisplay()}
        </Row>
      </Col>
    </Row>
  )
}


export default PositionInfoItem
