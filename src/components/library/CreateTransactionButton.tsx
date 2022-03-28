import { CSSProperties } from 'react'
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import { useHistory } from 'react-router-dom'
import { TransactionArgs, TransactionStatus } from '../../slices/transactions'
import waitFor from '../../slices/waitFor'
import ConnectWalletButton from './ConnectWalletButton'
import {
  Button,
  ButtonKind,
  ButtonSize,
  InlineLoading
} from 'carbon-components-react'
import {
  submitTransaction,
  getTxIDFromArgs,
} from '../../slices/transactions'
import { notEmpty } from '../../utils'
import { getSortedUserTxs } from './'

const CreateTransactionButton = ({
  txArgs,
  title,
  disabled,
  openTxTab,
  kind,
  size,
  style,
  showDisabledInsteadOfConnectWallet,
}: {
  txArgs: TransactionArgs
  title: string
  disabled: boolean
  openTxTab: boolean
  kind: ButtonKind
  size: ButtonSize
  style: CSSProperties
  showDisabledInsteadOfConnectWallet: boolean
}) => {
  const dispatch = useAppDispatch()
  const history = useHistory()

  const {
    chainID,
    userAddress,
    transactions,
    wallet,
  } = waitFor([
    'chainID',
    'userAddress',
    'transactions',
    'wallet'
  ], selector, dispatch)

  if (chainID === null || (userAddress === null && !showDisabledInsteadOfConnectWallet)) {
    return <ConnectWalletButton size={size} style={style} kind={kind} />
  }

  const currentTxID = getTxIDFromArgs(txArgs)

  const pendingTxs =
    getSortedUserTxs(chainID, userAddress, transactions)
      .filter(tx => tx.status === TransactionStatus.Pending)
      .filter(tx => getTxIDFromArgs(tx.args) === currentTxID)

  const pendingTxExists = notEmpty(pendingTxs)

  const buttonTitle =
    wallet.waitingForMetamask === currentTxID
    ? `${title}...`
    : title

  const openTxTabAction =
    openTxTab
      ? () => history.push('/transactions')
      : () => {}

  const txData = {
    args: txArgs,
    openTxTab: openTxTabAction,
    userAddress: userAddress!,
    chainID,
  }

  const showDisabled =
    pendingTxExists ||
    wallet.waitingForMetamask !== null ||
    disabled === true ||
    userAddress === null

  return (
    <Button
      kind={kind}
      size={size}
      style={style}
      renderIcon={pendingTxExists ? InlineLoading : undefined}
      onClick={() => dispatch(submitTransaction(txData))}
      disabled={showDisabled}>
      {buttonTitle}
    </Button>
  )
}

CreateTransactionButton.defaultProps = {
  title: 'Confirm',
  disabled: false,
  openTxTab: false,
  kind: 'primary',
  size: 'default',
  style: {},
  showDisabledInsteadOfConnectWallet: false,
}

export default CreateTransactionButton
