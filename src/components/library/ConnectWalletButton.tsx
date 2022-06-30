import MetaMaskOnboarding from "@metamask/onboarding"
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import { getWalletConnectedFunction } from '../PageHeader/Wallet'
import { Button, ButtonKind, ButtonSize } from 'carbon-components-react'
import { CSSProperties } from 'react';
import { walletConnecting, walletConnectionFailed } from '../../slices/wallet'
import { AppDispatch } from '../../app/store'
import { reportError, ErrorType } from '../../components/Errors'
import waitFor from '../../slices/waitFor'

const connectWallet = async (args: {dispatch: AppDispatch, address: string, chainID: number}) => {
  const { dispatch, address, chainID } = args
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
          reportError({
              errorType: ErrorType.WalletConnectError,
              error: { message: `Encountered unexpected error ${error.code}: '${error.message}'.`},
              address,
              chainId: chainID,
            },
            dispatch
          )
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

  const {
    userAddress,
    chainID,
    wallet,
  } = waitFor([
    'userAddress',
    'chainID',
    'wallet',
  ], selector, dispatch)

  const text = wallet.connecting
    ? 'Confirm in Metamask...'
    : (userAddress !== null
        ? 'Connected'
        : 'Connect a Wallet')

  const metamaskInstalled = MetaMaskOnboarding.isMetaMaskInstalled()

  const onClick = async () =>
    metamaskInstalled
    ? await connectWallet({
        dispatch,
        chainID: chainID === null ? 0 : chainID,
        address: userAddress === null ? '' : userAddress
      })
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
