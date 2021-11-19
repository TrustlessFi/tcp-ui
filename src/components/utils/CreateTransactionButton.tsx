import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import { useHistory } from 'react-router-dom'
import { TransactionArgs } from '../../slices/transactions'
import ConnectWalletButton from './ConnectWalletButton'
import { Button, ButtonKind, ButtonSize } from 'carbon-components-react'
import { waitForTransaction } from '../../slices/transactions/index';
import { CSSProperties } from 'react';

const CreateTransactionButton = ({
  txArgs,
  title,
  disabled,
  shouldOpenTxTab,
  small,
  kind,
  size,
  style,
  showDisabledInsteadOfConnectWallet,
}: {
  txArgs: TransactionArgs
  title: string
  disabled: boolean
  shouldOpenTxTab: boolean
  small: boolean
  kind: ButtonKind
  size: ButtonSize
  style: CSSProperties
  showDisabledInsteadOfConnectWallet: boolean
}) => {
  const dispatch = useAppDispatch()
  const history = useHistory()

  const waitingForMetamask = selector(state => state.wallet.waitingForMetamask)
  const userAddress = selector(state => state.wallet.address)

  if (userAddress === null && !showDisabledInsteadOfConnectWallet) return <ConnectWalletButton />

  const buttonDisplay =
    waitingForMetamask
    ? 'Waiting for Metamask Confirmation...'
    : title

  const openTxTab = shouldOpenTxTab
    ? () => history.push('/transactions')
    : () => {}

  return (
    <Button
      small={small}
      kind={kind}
      size={size}
      style={style}
      onClick={() => dispatch(waitForTransaction({args: txArgs, openTxTab, userAddress: userAddress!}))}
      disabled={waitingForMetamask || disabled === true || userAddress === null}>
      {buttonDisplay}
    </Button>
  )
}

CreateTransactionButton.defaultProps = {
  title: 'Confirm in Metamask',
  disabled: false,
  shouldOpenTxTab: true,
  small: false,
  kind: 'primary',
  size: 'default',
  style: {},
  showDisabledInsteadOfConnectWallet: false
};

export default CreateTransactionButton
