import { useAppSelector as selector } from '../../app/hooks'
import PositionEditor from './PositionEditor'
import ExistingPositions from './ExistingPositions'

export default ({}) =>
  selector(state => state.positionsEditor.open)
    ? <PositionEditor />
    : <ExistingPositions />
