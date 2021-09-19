import { AsyncThunk, ThunkDispatch, AnyAction, AsyncThunkAction } from '@reduxjs/toolkit';
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import { RootState } from '../../app/store'
import {
  Modal,
  Button,
} from 'carbon-components-react'
import { sliceState } from '../../slices/index';

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
  const [isPreviewApproved, setIsPreviewApproved] = useState(false)
  const state = selector(stateSelector)

  const cancel = () => {
    setIsPreviewApproved(false)
    onCancel()
  }

  if (!isActive) {
    return null
  } else if (!isPreviewApproved) {
    const onRequestSubmit = () => {
      dispatch(thunk)
      setIsPreviewApproved(true)
    }

    return (
      <Modal
        open
        preventCloseOnClickOutside
        size="sm"
        onRequestClose={() => cancel()}
        onRequestSubmit={onRequestSubmit}
        modalHeading="Confirmation"
        primaryButtonText={verb}
        secondaryButtonText="Cancel">
        {preview}
      </Modal>
    )
  } else if (state.write.error !== null) {
    return (
      <Modal
        open
        passiveModal
        preventCloseOnClickOutside
        size="sm"
        onRequestClose={() => cancel()}
        modalHeading="Error"
        primaryButtonText={verb}
        secondaryButtonText="Cancel">
        <>{state.write.error.message}</>
      </Modal>
    )
  } else if (state.write.hash.length === 0) {
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
  } else {
    return (
      <Modal
        open
        passiveModal
        preventCloseOnClickOutside
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
