import MetaMaskOnboarding from "@metamask/onboarding"
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import { connectWallet } from '../library/WalletConnection'
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

  const metamaskInstalled = MetaMaskOnboarding.isMetaMaskInstalled()

  const onClick = async () =>
    metamaskInstalled
    ? await connectWallet(dispatch)
    : (new MetaMaskOnboarding()).startOnboarding()

  return (
    <Button
      onClick={onClick}
      disabled={wallet.connecting}
      size={size}
      kind={kind}
      style={style}>
      {metamaskInstalled ? text : 'Install Metamask'}
    </Button>
  )
}

export default ConnectWalletButton
