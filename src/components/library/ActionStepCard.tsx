import { Tile } from 'carbon-components-react'
import LargeText from './LargeText'
import CreateTransactionButton from './CreateTransactionButton'
import { TransactionArgs } from '../../slices/transactions'
import {
  Number_132,
  Number_232,
  Number_332,
  Number_432,
  Number_532,
  Number_632,
  Number_732,
  Number_832,
  Number_932,
  Checkbox32,
  CheckboxChecked32,
} from '@carbon/icons-react'
import { red, orange, green, yellow, gray } from '@carbon/colors';
import { isMobile } from 'react-device-detect'

const numberToIcon = (value: number, color?: string) => {
  switch(value) {
    case 1:
      return <Number_132 color={color} />
    case 2:
      return <Number_232 color={color} />
    case 3:
      return <Number_332 color={color} />
    case 4:
      return <Number_432 color={color} />
    case 5:
      return <Number_532 color={color} />
    case 6:
      return <Number_632 color={color} />
    case 7:
      return <Number_732 color={color} />
    case 8:
      return <Number_832 color={color} />
    case 9:
      return <Number_932 color={color} />
    default:
      throw new Error(`${value} is invalid icon number`)
  }
}

const ActionStepCard = ({
  txArgs,
  disabled,
  step,
  title,
  buttonTitle,
  complete,
}: {
  txArgs: TransactionArgs
  disabled?: boolean
  step: number
  title: string
  buttonTitle: string
  complete?: boolean
}) => {
  const color = disabled ? gray[50] : undefined

  return (
    <div style={{overflow: 'hidden'}}>
      <div style={{display: 'float'}}>
        <div style={{float: 'right'}}>
          <CreateTransactionButton
            title={complete ? 'Complete' : buttonTitle}
            disabled={disabled}
            size='sm'
            kind='primary'
            txArgs={txArgs}
          />
        </div>
        <div style={{display: 'float', alignItems: 'center'}}>
          {
            isMobile
            ? null
            : <span style={{float: 'left', height: 32, width: 32}}>
                {numberToIcon(step, color)}
              </span>
          }
          <span style={{float: 'left', paddingTop: 2}}>
            <LargeText size={18} style={{marginLeft: 10}} color={color}>
              {title}
            </LargeText>
          </span>
        </div>
      </div>
    </div>
  )
}

export default ActionStepCard
