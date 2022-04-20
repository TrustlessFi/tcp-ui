import { Row } from 'react-flexbox-grid'
import { ReactNode } from 'react';
import Text from './Text'
import Center from './Center'
import PositionNumberInput from './PositionNumberInput'
import SpacedList from './SpacedList'
import TrustlessTooltip from '../library/TrustlessTooltip'

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
  tooltip,
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
  tooltip?: string
}) => {

  const input =
    <PositionNumberInput
      id='collateralInput'
      action={action}
      value={value}
      fontSize={fontSize}
      unit={unit}
      onFocusUpdate={onFocusUpdate}
      defaultButton={defaultButton}
      light={light}
      max={max}
    />

  return (
    <SpacedList style={{marginRight: 8}}>
      {
        title === undefined
        ? null
        : (
            tooltip === undefined
            ? <Text size={fontSize}>{title}</Text>
            : <SpacedList spacing={5} row>
                <Text size={fontSize}>{title}</Text>
                <TrustlessTooltip text={tooltip} />
              </SpacedList>
            )
      }
      {
        frozen
        ? <Row style={{position: 'relative', marginLeft: 0}}>
            <div style={{width: '100%', padding: 16, paddingTop: 14, height: 48, backgroundColor: light? '#323232' : '#262626'}}>
              <Text size={fontSize}>
                {value}
              </Text>
            </div>
            <Text
              size={12}
              style={{
                color: '#ffffff',
                opacity: 0.6,
                top: 18,
                right: 0,
                width: 52,
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
                right: 52,
                position: 'absolute',
              }}
            />
          </Row>
        : input
      }
      {
        <Text color='white' style={{opacity: 0.6}}>
          {
            center === true
            ? <Center>
                {subTitle}
              </Center>
            : subTitle
          }
        </Text>
      }
    </SpacedList>
  )
}

FullNumberInput.defaultProps = {
  fontSize: 18,
  inputFontSize: 24,
}

export default FullNumberInput
