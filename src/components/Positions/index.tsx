import { useAppSelector as selector } from '../../app/hooks'
import PositionEditor from './PositionEditor'
import ExistingPositions from './ExistingPositions'

const Positions = () =>
  selector(state => state.positionsEditor.open)
    ? <PositionEditor />
    : <ExistingPositions />

export default Positions
