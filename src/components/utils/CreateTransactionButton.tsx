import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import { TransactionArgs } from '../../slices/transactions'
import ConnectWalletButton from './ConnectWalletButton'
import { Button } from 'carbon-components-react'
import { waitForTransaction } from '../../slices/transactions/index';

const CreateTransactionButton = ({
  txArgs,
  title,
  disabled
}: {
  txArgs: TransactionArgs,
  title?: string
  disabled?: boolean
}) => {
  const dispatch = useAppDispatch()
  const transactions = selector(state => state.transactions)
  const userAddress = selector(state => state.wallet.address)

  if (userAddress === null) return <ConnectWalletButton />

  const buttonDisplay =
    transactions.waitingForMetamask
    ? 'Waiting for Metamask Confirmation...'
    : (title === undefined
      ? 'Confirm in Metamask'
      : title)

  return (
    <Button
      onClick={() => dispatch(waitForTransaction(txArgs))}
      disabled={transactions.waitingForMetamask || disabled === true}>
      {buttonDisplay}
    </Button>
  )
}

export default CreateTransactionButton
