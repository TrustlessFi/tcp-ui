import { CSSProperties } from 'react'
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import { useHistory } from 'react-router-dom'
import { TransactionArgs, TransactionStatus } from '../../slices/transactions'
import ConnectWalletButton from './ConnectWalletButton'
import { Button,  ButtonKind, ButtonSize, InlineLoading } from 'carbon-components-react'
import { submitTransaction } from '../../slices/transactions'
import { notEmpty } from '../../utils'

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

  const waitingForMetamask = selector(state => state.wallet.waitingForMetamask)
  const userAddress = selector(state => state.userAddress)
  const chainID = selector(state => state.chainID)
  const transactions = selector(state => state.transactions)

  if (chainID === null || (userAddress === null && !showDisabledInsteadOfConnectWallet)) {
    return <ConnectWalletButton size={size} style={style} kind={kind} />
  }

  // TODO filter for transactions that are relevant to this address and chain
  const pendingTxExists =
    notEmpty(
      Object.values(transactions)
        .filter(tx => tx.status === TransactionStatus.Pending)
        .filter(tx => tx.type === txArgs.type)
    )

  const buttonTitle =
    waitingForMetamask
    ? 'Confirm in Metamask...'
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

  return (
    <Button
      kind={kind}
      size={size}
      style={style}
      onClick={() => dispatch(submitTransaction(txData))}
      disabled={pendingTxExists || waitingForMetamask || disabled === true || userAddress === null}>
      {
        pendingTxExists
        ? <>
            <div style={{whiteSpace: 'nowrap', paddingRight: 12}}>
              {buttonTitle}
            </div>
            <InlineLoading />
          </>
        : buttonTitle
      }
    </Button>
  )
}

CreateTransactionButton.defaultProps = {
  title: 'Confirm in Metamask',
  disabled: false,
  openTxTab: false,
  kind: 'primary',
  size: 'default',
  style: {},
  showDisabledInsteadOfConnectWallet: false,
}

export default CreateTransactionButton
