import { useAppDispatch } from '../../app/hooks'
import MetaMaskOnboarding from "@metamask/onboarding"
import { connectWallet } from '../utils/WalletConnection'
import { Button } from 'carbon-components-react'

const ConnectWalletButton = ({
  mini
}: {
  mini?: boolean,
}) => {
  const dispatch = useAppDispatch()

  const onClick = async () => {
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      await connectWallet(dispatch)
    } else {
      // Set onboarding state?
      (new MetaMaskOnboarding()).startOnboarding()
    }
  }

  const sizeAttribute = mini === true ? { size: 'small' } : {}

  return (
    <Button {...sizeAttribute} onClick={onClick}>
      Connect a Wallet
    </Button>
  )
}

export default ConnectWalletButton
