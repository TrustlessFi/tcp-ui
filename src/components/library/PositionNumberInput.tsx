import { NumberInput } from 'carbon-components-react'
import { CSSProperties } from 'react';
import { Row } from 'react-flexbox-grid'
import { onNumChange }  from '../../utils/'
import Center from './Center'
import Text from './Text'

const PositionNumberInput = ({
  id,
  value,
  action,
  showSteppers,
  small,
  unit,
  fontSize,
  style,
  max,
  onFocusUpdate,
  light,
}: {
  id: string
  value: number
  action: (value: number) => void
  showSteppers: boolean
  small: boolean
  unit?: string
  fontSize?: number
  style?: CSSProperties
  max?: number
  onFocusUpdate?: (isFocused: boolean) => void
  light?: boolean
}) => {
  const invalidText = <></>
  const itemStyle = small
    ? {marginLeft: 8, marginRight: 8, paddingLeft: 10, paddingRight: 0, ...style}
    : style

  const rawInput =
    <NumberInput
      light={light}
      hideSteppers={!showSteppers}
      id={id}
      invalidText={invalidText}
      min={0}
      max={max}
      step={1e-6}
      size={small ? 'sm' : 'lg'}
      onChange={onNumChange((value: number) => action(value))}
      value={isNaN(value) ? "" : value }
      style={{...itemStyle, fontSize}}
      onFocus={onFocusUpdate === undefined ? () => {} : () => onFocusUpdate(true) }
      onBlur={onFocusUpdate === undefined ? () => {} : () => onFocusUpdate(false) }
    />

  if (small) return (
    <div style={{display: 'inline-block', width: 167, marginTop: 8}} >
      {rawInput}
    </div>
  )

  if (unit) {
      return (
        <Row style={{position: 'relative', marginLeft: 0}}>
          {rawInput}
          <Center>
            <Text
              size={fontSize}
              style={{
                top: 14,
                right: 48,
                position: 'absolute',
              }}>
              {unit}
            </Text>
          </Center>
        </Row>
      )
  }

  return rawInput
}

PositionNumberInput.defaultProps = {
  showSteppers: false,
  small: false,
}

export default PositionNumberInput
