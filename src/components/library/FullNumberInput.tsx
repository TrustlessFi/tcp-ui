import {
  Button,
} from 'carbon-components-react'
import { ReactNode } from 'react';
import Text from './Text'
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
}: {
  title: string
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
}) => {

  const input =
    <PositionNumberInput
      id="collateralInput"
      action={action}
      value={value}
      fontSize={fontSize}
      unit={unit}
      onFocusUpdate={onFocusUpdate}
    />

  return (
    <SpacedList>
      <Text size={fontSize}>{title}</Text>
      {
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
      }
      {subTitle}
    </SpacedList>
  )
}

FullNumberInput.defaultProps = {
  fontSize: 18,
}

export default FullNumberInput
