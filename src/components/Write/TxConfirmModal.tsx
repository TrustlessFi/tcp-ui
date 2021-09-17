import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import {
  Modal,
  Button,
} from 'carbon-components-react'
import { TxStage, TxType, createPositionPreview, txData, cancel, awaitConfirmation } from '../../slices/tx'


const descriptionToApprovalPreview = (data: txData) => {
  switch(data.type) {
    case TxType.CreatePosition:
      const description = data.description as createPositionPreview
      return (
        <>
          <div>
            <h3>Collateral:</h3><p>{description.collateral}</p>
          </div>
          <div>
            <h3>Debt:</h3><p>{description.debt}</p>
          </div>
          <div>
            <h3>Eth Price:</h3><p>{description.ethPrice}</p>
          </div>
          <div>
            <h3>Liquidation Price:</h3><p>{description.liquidationPrice}</p>
          </div>
        </>
      )
  }
}

export default () => {
  const dispatch = useAppDispatch()
  const txStatus = selector(state => state.tx)

  let content: JSX.Element
  switch(txStatus.stage) {
    case TxStage.Standby:
      return null
    case TxStage.AwaitingPreviewApproval:
      content = descriptionToApprovalPreview(txStatus.data!)
      break
    case TxStage.AwaitingConfirmation:
      content = <>{txStatus.data!.description.mediumName}</>
      break
    case TxStage.TxSubmitted:
      content =
        <>
          <div><p>Transaction submitted</p></div>
          <div><p>View in Explorer</p></div>
        </>
        break
  }
  /*
  console.log("here 1")
  dispatch(cancel)
  console.log("here 2")

  content = <>{content}<Button onClick={() => { dispatch(cancel); console.log("request close"); } }>Click me</Button></>
  */

  return (
    <Modal
      open
      size="sm"
      onRequestClose={() => { dispatch(cancel); console.log("request close"); }}
      onRequestSubmit={() => { dispatch(awaitConfirmation); console.log("AWAIT CONFIRM"); }}
      // onRequestClose={() => dispatch(cancel)}
      // onRequestSubmit={() => dispatch(awaitConfirmation)}
      modalHeading="Account"
      primaryButtonText="Add"
      secondaryButtonText="Cancel">
      {content}
    </Modal>
  )
}
