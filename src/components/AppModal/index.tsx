import { AsyncThunkAction } from '@reduxjs/toolkit';
import { useState, ReactNode } from 'react'
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import { RootState, AppDispatch } from '../../app/store'
import {
  Modal,
} from 'carbon-components-react'
import { sliceState } from '../../slices'
import { modalData, closeModal, createPositionModalData, lendModalData } from '../../slices/modal'
import { TransactionType, getTxNamePastTense, getTxNamePresentTense } from '../../slices/transactions'
import { numDisplay, assertUnreachable } from '../../utils'
import LargeText from '../utils/LargeText'
import Text from '../utils/Text'
import { ModalState, ModalStage, openModal } from '../../slices/modal/'
import { waitForTransaction } from '../../slices/transactions'
import ExplorerLink from '../utils/ExplorerLink'

const getModalPreview = (data: NonNullable<modalData>) => {
  switch(data.args.type) {
    case TransactionType.CreatePosition:
      data = data as createPositionModalData

      const items = [
        {
          title: 'Collateral',
          value: numDisplay(data.args.collateralCount, 2) + ' Eth',
        },{
          title: 'Debt',
          value: numDisplay(data.args.debtCount, 2) + ' Hue',
        },{
          title: 'Eth Price',
          value: numDisplay(data.ethPrice, 2) + ' Hue/Eth',
        },{
          title: 'Liquidation Price',
          value: numDisplay(data.liquidationPrice, 2) + ' Hue/Eth',
        }
      ]

      const preview = items.map((item, index) =>
        <div key={index}>
          <LargeText>
            {item.title + ': '}
          </LargeText>
          <Text>
            {item.value}
          </Text>
        </div>
      )

      return <>{preview}</>

    case TransactionType.Lend:
      data = data as lendModalData
      return (
        <div>
          <LargeText>
            Count:
          </LargeText>
          <Text>
            {data.args.count}
          </Text>
        </div>
      )
  }
}

const getVerb = (data: NonNullable<modalData>) => {
  switch(data.args.type) {
    case TransactionType.CreatePosition:
      return 'Create'
    case TransactionType.Lend:
      return 'Lend'
  }
}

const getShortName = (data: NonNullable<modalData>) => {
  switch(data.args.type) {
    case TransactionType.CreatePosition:
      return 'Creating a Position'
    case TransactionType.Lend:
      return 'Lending'
  }
}

const getMediumName = (data: NonNullable<modalData>) => {
  switch(data.args.type) {
    case TransactionType.CreatePosition:
      return 'Creating a position with '
        + numDisplay(data.args.collateralCount, 2)
        + ' Eth of collateral and '
        + numDisplay(data.args.debtCount, 2)
        + ' Hue of debt.'
    case TransactionType.Lend:
      return 'Lending ' + numDisplay(data.args.count, 2) + ' Hue.'
  }
}

interface modalProps {
  modalHeading: string
  preventCloseOnClickOutside?: boolean
  primaryButtonText?: string
  passiveModal?: boolean
}

interface modalContent {
  props: modalProps
  content: ReactNode
}

const getModalContent = (
  stage: Exclude<ModalStage, ModalStage.Closed>,
  data: NonNullable<modalData>,
  hash?: string,
  failureMessages?: string[],
): modalContent => {

  const verb = getVerb(data)

  switch(stage) {
    case ModalStage.Preview:
      return {
        content: getModalPreview(data),
        props: {
          modalHeading: getTxNamePresentTense(data.args.type) + 'Transaction Preview',
          primaryButtonText: verb,
        }
      }
    case ModalStage.WaitingForMetamaskConfirmation:
      return {
        content: getMediumName(data),
        props: {
          modalHeading: 'Please confirm in metamask',
          passiveModal: true,
        }
      }
    case ModalStage.WaitingForCompletion:
      return {
        content: getMediumName(data),
        props: {
          modalHeading: 'Waiting for Transaction',
          passiveModal: true,
        }
      }
    case ModalStage.Success:
      return {
        content: getTxNamePastTense(data.args.type),
        props: {
          modalHeading: 'Transaction Succeeded',
          passiveModal: true,
        }
      }
    case ModalStage.Failure:
      const content = failureMessages!.length === 0
        ? <>
            Transaction Failed. View on explorer to find out why.
            <div><ExplorerLink txHash={hash!}>View on Explorer</ExplorerLink></div>
          </>
        : <>
            <div key={-1}>{getShortName(data)} failed with message:</div>
            {failureMessages!.map((m, index) => <div key={index}>{m}</div>)}
          </>
      return {
        content,
        props: {
          modalHeading: 'Transaction Failed',
          passiveModal: true,
        }
      }
    default:
      assertUnreachable(stage)
  }
  throw new Error('AppModal: Should not get here' )
}

const AppModal = ({}: {}) => {
  const dispatch = useAppDispatch()
  const modalState = selector(state => state.modal)

  if (modalState.data === null || modalState.stage === ModalStage.Closed) return null
  const modalContent = getModalContent(modalState.stage, modalState.data, modalState.hash, modalState.failureMessages)
  const props = modalContent.props

  const onRequestSubmit = () => dispatch(waitForTransaction(modalState.data!.args))

  return (
    <Modal
      open
      size="sm"
      {...props}
      secondaryButtonText="Cancel"
      onRequestClose={() => dispatch(closeModal())}
      onRequestSubmit={() => onRequestSubmit()}>
      {modalContent.content}
    </Modal>
  )
}

export default AppModal
