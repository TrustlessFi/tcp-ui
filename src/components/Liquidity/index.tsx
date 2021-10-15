import CreateLiquidityPosition from './CreateLiquidityPosition'
import UpdateLiquidityPosition from './UpdateLiquidityPosition'
import ExistingPositions from './ExistingPositions'
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import {
  Button,
} from 'carbon-components-react'
import { editorClosed } from '../../slices/liquidityPositionsEditor'

const LiquidityPositions = () => {
  const dispatch = useAppDispatch()
  const liquidityPositionsEditor = selector(state => state.liquidityPositionsEditor)

  if (!liquidityPositionsEditor.open) return <ExistingPositions />

  return (
    <>
      <div style={{marginBottom: 32}}>
        <Button onClick={() => dispatch(editorClosed())}>Go Back</Button>
      </div>
      {(liquidityPositionsEditor.status.creating
      ? <CreateLiquidityPosition />
      : <UpdateLiquidityPosition id={liquidityPositionsEditor.status.positionID} />)}
    </>
  )
}

export default LiquidityPositions
