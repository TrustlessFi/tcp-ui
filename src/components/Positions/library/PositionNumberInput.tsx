import {
  NumberInput,
} from 'carbon-components-react'
import { onNumChange }  from '../../../utils/'

const PositionNumberInput = ({
  id,
  value,
  action,
}: {
  id: string,
  value: number,
  action: (value: number) => void
}) => {
  const invalidText = <></>
  return (
    <div style={{display: 'inline-block', width: 167}} >
      <NumberInput
        hideSteppers
        id={id}
        invalidText={invalidText}
        min={0}
        step={1e-6}
        size="sm"
        onChange={onNumChange((value: number) => action(value))}
        value={isNaN(value) ? "" : value }
        style={{marginLeft: 8, marginRight: 8, paddingLeft: 10, paddingRight: 0}}
      />
    </div>
  )
}

export default PositionNumberInput
