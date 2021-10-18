import { ReactNode } from 'react'
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import {
  Modal,
} from 'carbon-components-react'
import { modalData, closeModal, createPositionModalData, updatePositionModalData, lendModalData, createLiquidityPositionModalData } from '../../slices/modal'
import { TransactionType, getTxNamePastTense, getTxNamePresentTense } from '../../slices/transactions'
import { numDisplay, assertUnreachable } from '../../utils'
import LargeText from '../utils/LargeText'
import Text from '../utils/Text'
import { ModalStage } from '../../slices/modal/'
import { waitForTransaction } from '../../slices/transactions'
import ExplorerLink from '../utils/ExplorerLink'

const getModalPreview = (data: NonNullable<modalData>) => {
  const getDisplayFromUpdateItems = (items: {title: string, value: string}[]) =>
    <>
      {items.map((item, index) =>
        <div key={index}>
          <LargeText>
            {item.title + ': '}
          </LargeText>
          <Text>
            {item.value}
          </Text>
        </div>
      )}
      </>



  const type = data.args.type
  switch(type) {
    case TransactionType.CreatePosition:
      data = data as createPositionModalData

      return getDisplayFromUpdateItems([
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
      ])

    case TransactionType.UpdatePosition:
      data = data as updatePositionModalData

      const collateralIncrease = data.args.collateralIncrease
      const debtIncrease = data.args.debtIncrease

      return getDisplayFromUpdateItems([
        {
          title: collateralIncrease > 0 ? 'Collateral Increase' : 'Collateral Decrease',
          value: numDisplay(Math.abs(collateralIncrease), 2) + ' Eth',
        },{
          title: debtIncrease > 0 ? 'Debt Increase' : 'Debt Decrease',
          value: numDisplay(Math.abs(debtIncrease), 2) + ' Hue',
        },{
          title: 'Collateralization',
          value: numDisplay(data.collateralization * 100, 2) + '%',
        },{
          title: 'Minimum Collateralization',
          value: numDisplay(data.minCollateralization * 100, 2) + '%',
        },{
          title: 'Eth Price',
          value: numDisplay(data.ethPrice, 2) + ' Hue/Eth',
        },{
          title: 'Liquidation Price',
          value: numDisplay(data.liquidationPrice, 2) + ' Hue/Eth',
        }
      ])

    case TransactionType.CreateLiquidityPosition:
      data = data as createLiquidityPositionModalData
      return getDisplayFromUpdateItems([{
        title: data.token0Symbol,
        value: numDisplay(data.args.amount0Desired),
      },{
        title: data.token1Symbol,
        value: numDisplay(data.args.amount1Desired),
      }])

    case TransactionType.Lend:
    case TransactionType.Withdraw:
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
    default:
      assertUnreachable(type)
  }
}

const getVerb = (data: NonNullable<modalData>) => {
  const type = data.args.type
  switch(type) {
    case TransactionType.CreateLiquidityPosition:
    case TransactionType.CreatePosition:
      return 'Create'
    case TransactionType.UpdatePosition:
      return 'Update'
    case TransactionType.Lend:
      return 'Lend'
    case TransactionType.Withdraw:
      return 'Withdraw'
    default:
      assertUnreachable(type)
  }
}

const getShortName = (data: NonNullable<modalData>) => {
  const type = data.args.type
  switch(type) {
    case TransactionType.CreateLiquidityPosition:
    case TransactionType.CreatePosition:
      return 'Creating a Position'
    case TransactionType.UpdatePosition:
      return 'Updating a Position'
    case TransactionType.Lend:
      return 'Lending'
    case TransactionType.Withdraw:
      return 'Withdrawing'
    default:
      assertUnreachable(type)
  }
}

const getMediumName = (data: NonNullable<modalData>) => {
  const type = data.args.type
  switch(type) {

    case TransactionType.CreatePosition:
      return 'Creating a position with '
        + numDisplay(data.args.collateralCount, 2)
        + ' Eth of collateral and '
        + numDisplay(data.args.debtCount, 2)
        + ' Hue of debt.'

    case TransactionType.CreateLiquidityPosition:
      return [
        'Creating a position with',
        data.args.amount0Desired,
        (data as createLiquidityPositionModalData).token0Symbol,
        'and',
        data.args.amount1Desired,
        (data as createLiquidityPositionModalData).token1Symbol,
        '.'
      ].join(' ')

    case TransactionType.UpdatePosition:

      const collateralIncrease = data.args.collateralIncrease
      const collateralChangeString = collateralIncrease === 0 ? '' : (
        collateralIncrease > 0
        ? ' Increasing collateral by ' + numDisplay(collateralIncrease, 2) + ' Eth'
        : ' Decreasing collateral by ' + numDisplay(-collateralIncrease, 2) + ' Eth'
      )
      const debtIncrease = data.args.debtIncrease
      const debtChangeString = debtIncrease === 0 ? '' : (
        debtIncrease > 0
        ? ' Increasing debt by ' + numDisplay(debtIncrease, 2) + ' Hue'
        : ' Decreasing debt by ' + numDisplay(-debtIncrease, 2) + ' Hue'
      )

      const actionString =
        (debtChangeString.length > 0 && collateralChangeString.length > 0)
        ? collateralChangeString + ' and ' + debtChangeString
        : (debtChangeString.length > 0
            ? debtChangeString
            : collateralChangeString
          )

      return 'Updating position '
        + data.args.positionID
        + ' by '
        + actionString
        + '.'

    case TransactionType.Lend:
      return 'Lending ' + numDisplay(data.args.count, 2) + ' Hue.'

    case TransactionType.Withdraw:
      return 'Withdrawing ' + numDisplay(data.args.count, 2) + ' Hue.'

    default:
      assertUnreachable(type)
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
          modalHeading: getTxNamePresentTense(data.args.type) + ' Transaction Preview',
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

const AppModal = () => {
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
