import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import UpdatePosition from './UpdatePosition'
import CreatePosition from './CreatePosition'
import ExistingPositions from './ExistingPositions'
import {
  Button,
} from 'carbon-components-react'
import { editorClosed } from '../../slices/positionsEditor'

const Positions = () => {
  const dispatch = useAppDispatch()
  const positionsEditor = selector(state => state.positionsEditor)

  if (!positionsEditor.open) return <ExistingPositions />

  return (
    <>
      <div style={{marginBottom: 32}}>
        <Button onClick={() => dispatch(editorClosed())}>Go Back</Button>
      </div>
      {(positionsEditor.status.creating
      ? <CreatePosition />
      : <UpdatePosition id={positionsEditor.status.positionID} />)}
    </>
  )
}

export default Positions
