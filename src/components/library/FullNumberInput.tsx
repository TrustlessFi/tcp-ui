import {
  Button,
  Tile,
} from 'carbon-components-react'
import { Row } from 'react-flexbox-grid'
import { ReactNode } from 'react';
import Text from './Text'
import Center from './Center'
import PositionNumberInput from './PositionNumberInput'
import SpacedList from './SpacedList'

const FullNumberInput = ({
  title,
  action,
  value,
  fontSize,
  unit,
  defaultButton,
  subTitle,
  onFocusUpdate,
  light,
  max,
  center,
  frozen,
}: {
  title?: string
  action: (value: number) => void
  value: number

  fontSize?: number
  unit?: string
  defaultButton?: {
    title: string,
    action: () => void,
  }
  subTitle?: string | ReactNode
  onFocusUpdate?: (isFocused: boolean) => void
  light?: boolean
  max?: number
  center?: boolean
  frozen?: boolean
}) => {

  const input =
    <PositionNumberInput
      id="collateralInput"
      action={action}
      value={value}
      fontSize={fontSize}
      unit={unit}
      onFocusUpdate={onFocusUpdate}
      light={light}
      max={max}
    />

  return (
    <SpacedList>
      { title === undefined
        ? null
        : <Text size={fontSize}>{title}</Text>
      }
      {
        frozen
        ? <Row style={{position: 'relative', marginLeft: 0}}>
            <div style={{width: '100%', padding: 16, paddingTop: 14, height: 48, backgroundColor: light? '#323232' : '#262626'}}>
              <Text size={fontSize}>
                {value}
              </Text>
            </div>
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
        : (
          defaultButton === undefined
          ? <div style={{marginRight: 8}}>{input}</div>
          : <div style={{display: 'flex'}}>
              <div style={{float: 'left', width: '100%', marginRight: '1em'}}>
                {input}
              </div>
              <div style={{float: 'right'}}>
                <Button style={{width: 100}} kind='secondary' onClick={defaultButton.action}>{defaultButton.title}</Button>
              </div>
            </div>
        )
      }
      {
        center === true
        ? <Center>
            {subTitle}
          </Center>
        : subTitle
      }
    </SpacedList>
  )
}

FullNumberInput.defaultProps = {
  fontSize: 18,
  inputFontSize: 24,
}

export default FullNumberInput
