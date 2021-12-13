import MetaMaskOnboarding from "@metamask/onboarding"
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import { connectWallet } from '../utils/WalletConnection'
import { Button, ButtonKind, ButtonSize } from 'carbon-components-react'
import { CSSProperties } from 'react';

const ConnectWalletButton = ({
  size,
  style,
  kind,
}: {
  size?: ButtonSize
  style?: CSSProperties
  kind?: ButtonKind
}) => {
  const dispatch = useAppDispatch()

  const wallet = selector(state => state.wallet)

  const text = wallet.connecting
    ? 'Waiting for User in Metamask...'
    : (wallet.address !== null
        ? 'Connected'
        : 'Connect a Wallet')

  const onClick = async () => {
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      await connectWallet(dispatch)
    } else {
      // Set onboarding state?
      (new MetaMaskOnboarding()).startOnboarding()
    }
  }

  return (
    <Button
      onClick={onClick}
      disabled={wallet.connecting}
      size={size}
      kind={kind}
      style={style}>
      {text}
    </Button>
  )
}

export default ConnectWalletButton
