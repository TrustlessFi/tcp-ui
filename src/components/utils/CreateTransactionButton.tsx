import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import History, { useHistory } from 'react-router-dom'
import { TransactionArgs } from '../../slices/transactions'
import ConnectWalletButton from './ConnectWalletButton'
import { Button } from 'carbon-components-react'
import { waitForTransaction } from '../../slices/transactions/index';

const CreateTransactionButton = ({
  txArgs,
  title,
  disabled,
  shouldOpenTxTab,
}: {
  txArgs: TransactionArgs
  title?: string
  disabled?: boolean
  shouldOpenTxTab: boolean
}) => {
  const dispatch = useAppDispatch()
  const history = useHistory()

  const waitingForMetamask = selector(state => state.wallet.waitingForMetamask)
  const userAddress = selector(state => state.wallet.address)

  if (userAddress === null) return <ConnectWalletButton />

  const buttonDisplay =
    waitingForMetamask
    ? 'Waiting for Metamask Confirmation...'
    : (title === undefined
      ? 'Confirm in Metamask'
      : title)

  const openTxTab = shouldOpenTxTab
    ? () => history.push('/transactions')
    : () => {}


  return (
    <Button
      onClick={() => dispatch(waitForTransaction({args: txArgs, openTxTab, userAddress}))}
      disabled={waitingForMetamask || disabled === true}>
      {buttonDisplay}
    </Button>
  )
}

CreateTransactionButton.defaultProps = {
  shouldOpenTxTab: true,
};

export default CreateTransactionButton
