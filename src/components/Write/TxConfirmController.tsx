import { AsyncThunk, ThunkDispatch, AnyAction, AsyncThunkAction } from '@reduxjs/toolkit';
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import { RootState } from '../../app/store'
import {
  Modal,
  Button,
} from 'carbon-components-react'
import { ContractTransaction } from 'ethers'
import { sliceState } from '../../slices/index';

enum Stage {
  AwaitingPreviewApproval,
  AwaitingConfirmation,
  TxSubmitted,
}

const stageToNextStage = (stage: Stage) => {
  switch(stage) {
    case Stage.AwaitingPreviewApproval:
      return Stage.AwaitingConfirmation
    case Stage.AwaitingConfirmation:
      return Stage.TxSubmitted
    case Stage.TxSubmitted:
      return Stage.TxSubmitted

  }

}

export default <Args extends {}, Value>({
  thunk,
  preview,
  verb,
  mediumName,
  shortName,
  onCancel,
  isActive,
  stateSelector,
}: {
  thunk: AsyncThunkAction<string, Args, {}>
  preview: JSX.Element
  verb: string,
  mediumName: string
  shortName: string
  onCancel: () => void
  isActive: boolean
  stateSelector: (state: RootState) => sliceState<Value>,
}) => {
  const dispatch = useAppDispatch()
  const [stage, setStage] = useState(Stage.AwaitingPreviewApproval)
  const state = selector(stateSelector)

  if (stage === Stage.AwaitingConfirmation && state.write.hash.length > 0) {
    setStage(Stage.TxSubmitted)
  }

  if (!isActive) return null

  const cancel = () => {
    setStage(Stage.AwaitingPreviewApproval)
    onCancel()
  }

  switch(stage) {
    case Stage.AwaitingPreviewApproval:
      const onRequestSubmit = () => {
        dispatch(thunk)
        setStage(Stage.AwaitingConfirmation)
      }

      return (
        <Modal
          open
          size="sm"
          onRequestClose={() => cancel()}
          onRequestSubmit={onRequestSubmit}
          modalHeading="Confirmation"
          primaryButtonText={verb}
          secondaryButtonText="Cancel">
          {preview}
        </Modal>
      )
    case Stage.AwaitingConfirmation:
      return (
        <Modal
          open
          passiveModal
          preventCloseOnClickOutside
          size="sm"
          onRequestClose={() => cancel()}
          modalHeading="Confirmation"
          primaryButtonText={verb}
          secondaryButtonText="Cancel">
          <>{mediumName}</>
        </Modal>
      )
    case Stage.TxSubmitted:
      return (
        <Modal
          open
          size="sm"
          onRequestSubmit={cancel}
          onRequestClose={cancel}
          modalHeading="Confirmation"
          primaryButtonText={verb}
          secondaryButtonText="Cancel">
          <>
            <div><p>Transaction submitted</p></div>
            <div><p>View in Explorer</p></div>
          </>
        </Modal>
      )
  }
}
