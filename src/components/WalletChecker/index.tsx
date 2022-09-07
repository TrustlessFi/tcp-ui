import MetaMaskOnboarding from "@metamask/onboarding"
import { FunctionComponent, ReactNode } from "react"
import Center from '../library/Center'
import ConnectWalletButton from '../library/ConnectWalletButton'
import SwitchNetworkButton from '../library/SwitchNetworkButton'
import waitFor from '../../slices/waitFor'
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'

const TakeWalletAction: FunctionComponent<{walletAction: ReactNode}> = ({ walletAction }) => {
  return (
    <Center style={{marginTop: '10%'}}>
      <div style={{marginTop: 20}}>
        {walletAction}
      </div>
    </Center>
  )
}

const WalletChecker: FunctionComponent<{children: ReactNode}> = ({ children }) => {
  const dispatch = useAppDispatch()

  const {
    chainID,
    wallet,
  } = waitFor([
    'chainID',
    'wallet',
  ], selector, dispatch)

  if (!MetaMaskOnboarding.isMetaMaskInstalled()) {
    return <TakeWalletAction walletAction={<ConnectWalletButton />} />
  }


  if (chainID === null) {
    return (
      wallet.initialized
      // ChainID has loaded and it is an invalid chainID
      ? <TakeWalletAction walletAction={<SwitchNetworkButton />} />
      // we don't have any info about chainID, don't show anything
      : null
    )
  }

  // ChainID has loaded and it is a valid chainID. The views will handle userAddress being not known.
  return <>{children}</>
}
export default WalletChecker
