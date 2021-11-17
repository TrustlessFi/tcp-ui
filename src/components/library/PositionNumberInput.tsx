import {
  NumberInput,
} from 'carbon-components-react'
import { onNumChange }  from '../../utils/'

const PositionNumberInput = ({
  id,
  value,
  action,
  showSteppers,
  small,
}: {
  id: string
  value: number
  action: (value: number) => void
  showSteppers: boolean
  small: boolean
}) => {
  const invalidText = <></>
  const style = small
    ? {marginLeft: 8, marginRight: 8, paddingLeft: 10, paddingRight: 0}
    : {}

  const input =
    <NumberInput
      hideSteppers={!showSteppers}
      id={id}
      invalidText={invalidText}
      min={0}
      step={1e-6}
      size={small ? 'sm' : 'lg'}
      onChange={onNumChange((value: number) => action(value))}
      value={isNaN(value) ? "" : value }
      style={style}
    />

  return small
    ? <div style={{display: 'inline-block', width: 167, marginTop: 8}} >
        {input}
      </div>
    : input
}

PositionNumberInput.defaultProps = {
  showSteppers: false,
  small: false,
}

export default PositionNumberInput
