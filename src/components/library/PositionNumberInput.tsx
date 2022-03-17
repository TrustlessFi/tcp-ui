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
  defaultButton,
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
  defaultButton?: {
    title: string,
    action: () => void,
  }
}) => {
  const invalidText = <></>
  const itemStyle = small
    ? {marginLeft: 8, marginRight: 8, paddingLeft: 10, paddingRight: 0, ...style}
    : style

  const rawInput =
    <NumberInput
      light={light}
      allowEmpty={true}
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
              size={12}
              style={{
                color: '#ffffff',
                opacity: 0.6,
                top: 18,
                width: 52,
                right: 0,
                position: 'absolute',
              }}>
              <Center>
                {unit}
              </Center>
            </Text>
            <div
              style={{
                borderLeft: '1px solid #222222',
                width: 1,
                height: 48,
                bottom: 0,
                right: 52,
                position: 'absolute',
              }}
            />
            {
              defaultButton === undefined
              ? null
              : <span
                  style={{cursor: 'pointer'}}
                  onClick={defaultButton.action}>
                  <Text
                    size={12}
                    style={{
                      color: '#ffffff',
                      opacity: 0.6,
                      top: 18,
                      right: 74,
                      textDecoration: 'underline',
                      position: 'absolute',
                    }}>
                    {defaultButton.title}
                  </Text>
                </span>
            }
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
