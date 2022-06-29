import { Tile, Button } from 'carbon-components-react'
import LargeText from './LargeText'
import { numDisplay } from '../../utils'
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import waitFor from '../../slices/waitFor'

const CopyErrorsTile = () => {
  const dispatch = useAppDispatch()

  const {
    errors,
  } = waitFor([
    'errors',
  ], selector, dispatch)

  const countErrors = errors.renderErrors.length + errors.walletErrors.length

  return (
    <Tile style={{
      paddingTop: 20,
      paddingBottom: 20,
      paddingLeft: 40,
      paddingRight: 40,
      height: 72,
    }}>
      <div style={{display: 'float'}}>
        <div style={{float: 'right'}}>
          <Button
            size='sm'
            kind='secondary'
            disabled={countErrors === 0}
            onClick={() => navigator.clipboard.writeText(JSON.stringify(errors))}>
            Copy Errors
          </Button>
        </div>
        <div style={{display: 'float', alignItems: 'center'}}>
          <span style={{float: 'left', paddingTop: 2}}>
            <LargeText size={18} style={{marginLeft: 10}}>
              {numDisplay(countErrors)} Errors
            </LargeText>
          </span>
        </div>
      </div>
    </Tile>
  )
}

export default CopyErrorsTile
