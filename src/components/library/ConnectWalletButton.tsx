import MetaMaskOnboarding from "@metamask/onboarding"
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import { getWalletConnectedFunction } from '../PageHeader/Wallet'
import { Button, ButtonKind, ButtonSize } from 'carbon-components-react'
import { CSSProperties } from 'react';
import { walletConnecting, walletConnectionFailed } from '../../slices/wallet'
import { AppDispatch } from '../../app/store'

const connectWallet = async (dispatch: AppDispatch) => {
  dispatch(walletConnecting())

  const walletConnected = getWalletConnectedFunction(dispatch)

  return window.ethereum
    .request({ method: 'eth_requestAccounts' })
    .then(walletConnected)
    .catch((error: {code: number, message: string}) => {
      switch (error.code) {
        case 4001:
          console.warn('Wallet connection rejected by user.')
          break
        default:
          console.error(`Encountered unexpected error ${error.code}: '${error.message}'.`)
      }

      dispatch(walletConnectionFailed())
    })
}

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

  const userAddress = selector(state => state.userAddress)
  const wallet = selector(state => state.wallet)

  const text = wallet.connecting
    ? 'Waiting for User in Metamask...'
    : (userAddress !== null
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
