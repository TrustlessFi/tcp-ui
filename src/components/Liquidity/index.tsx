import CreateLiquidityPosition from './CreateLiquidityPosition'
import UpdateLiquidityPosition from './UpdateLiquidityPosition'
import ExistingLiquidityPositions from './ExistingLiquidityPositions'
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import {
  Button,
} from 'carbon-components-react'
import { close, LiquidityPositionEditorStatus } from '../../slices/liquidityPositionsEditor'


const LiquidityPositions = () => {
  const dispatch = useAppDispatch()
  const liquidityPositionsEditor = selector(state => state.liquidityPositionsEditor)

  const closeButton = (
    <div style={{marginBottom: 32}}>
      <Button onClick={() => dispatch(close())}>Go Back</Button>
    </div>
  )

  const status = liquidityPositionsEditor.status

  switch(status) {
    case LiquidityPositionEditorStatus.Closed:
      return <ExistingLiquidityPositions />
    case LiquidityPositionEditorStatus.Create:
      return (
        <>
          {closeButton}
          <CreateLiquidityPosition poolAddress={liquidityPositionsEditor.poolAddress} />
        </>
      )
    case LiquidityPositionEditorStatus.Edit:
      return (
        <>
          {closeButton}
          <UpdateLiquidityPosition positionID={liquidityPositionsEditor.positionID} />
        </>
      )
  }
}

export default LiquidityPositions
