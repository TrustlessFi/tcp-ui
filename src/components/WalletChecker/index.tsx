import MetaMaskOnboarding from "@metamask/onboarding"
import { FunctionComponent, ReactNode } from "react"
import { useState, useEffect } from "react"
import { Button } from "carbon-components-react"
import { ChainID, chainIDToName } from '@trustlessfi/addresses'
import Center from '../library/Center'
import ConnectWalletButton from '../library/ConnectWalletButton'
import { makeRPCRequest, first, RpcMethod, numberToHex } from '../../utils'
import waitFor from '../../slices/waitFor'
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'

const TakeWalletAction: FunctionComponent<{walletAction: ReactNode}> = ({ walletAction }) => {
  return (
    <Center style={{marginTop: '10%'}}>
      {walletAction}
    </Center>
  )
}

const WalletChecker: FunctionComponent<{}> = ({ children }) => {
  const dispatch = useAppDispatch()

  const {
    rootContracts,
    chainID,
    wallet,
  } = waitFor([
    'rootContracts',
    'chainID',
    'wallet',
  ], selector, dispatch)

  const [ clicked, setClicked ] = useState(false)

  useEffect(() => {
    if (chainID !== null) setClicked(false)
  }, [chainID])

  if (!MetaMaskOnboarding.isMetaMaskInstalled()) {
    return <TakeWalletAction walletAction={<ConnectWalletButton />} />
  }

  console.log({rootContracts, chainID})

  if (chainID === null && !wallet.initialized) {
    // we don't have any info about chainID, don't show anything
    return null
  }
  // ChainID has loaded and it is an invalid chainID
  if (chainID === null && wallet.initialized) {
    const correctChainID =
      first((
        Object.values(ChainID)
          .filter(id => Number.isInteger(id)) as number[]).sort((a, b) => a - b))

    const switchNetwork = async () => {
      setClicked(true)
      await makeRPCRequest({
        method: RpcMethod.SwitchChain,
        chainId: numberToHex(correctChainID as number),
      }).catch(_e => setClicked(false))
    }

    return  (
      <TakeWalletAction
        walletAction={
          <Button kind='danger' onClick={switchNetwork}>
            {clicked ? 'Confirm in Metamask...' : `Switch to ${chainIDToName(correctChainID)}`}
          </Button>
        }
      />
    )
  }

  // ChainID has loaded and it is a valid chainID. The views will handle userAddress being not known.
  return <>{children}</>
}
export default WalletChecker
