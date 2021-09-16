import { useEffect, useState } from "react";
import MetaMaskOnboarding from "@metamask/onboarding";
import { Button, Tag, ModalWrapper } from 'carbon-components-react';
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import { connected, connectionFailed, connecting } from '../../slices/wallet'
import { chainIDFound } from '../../slices/chainID'
import { abbreviateAddress } from '../../utils'
import { chainIDToName, ChainID } from '../../slices/chainID'
import WalletModal from './WalletModal'

export default () => {
  const dispatch = useAppDispatch()

  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false)

  const chainChanged = (chainID: number | string) => {

    // also refetch some of the accounts if the chain has changed from something valid to something valid
    // can probalby combine some logic with wallet connected

    if (typeof chainID === 'string') chainID = parseInt(chainID)
    dispatch(chainIDFound(chainID))
  }

  const connectWallet = async () => {
    dispatch(connecting())

    return window.ethereum
      .request({ method: 'eth_requestAccounts' })
      .then(walletConnected)
      .catch((error: {code: number, message: string}) => {
        switch (error.code) {
          case 4001:
            console.error({
              content: 'Connection Rejected.',
              kind: 'warning'
            });
            break;
          default:
            console.error({
              content: `Encountered unexpected error ${error.code}:${error.message}. Check console or try again.`,
              kind: 'error'
            });
        }

        dispatch(connectionFailed())
      })
  }

  const walletConnected = (accounts: string[]) => {
    // TODO if new account is different than the current account, and the current account isn't null
    // then clear all of the slices that depend on the user data
    let account = accounts && accounts[0]
    if (account == null) return

    dispatch(connected(account))
  }

  useEffect(() => {
    const { ethereum } = window;
    if (!ethereum) return

    ethereum.request({ method: "eth_chainId" }).then(chainChanged);

    ethereum.on("chainChanged", chainChanged);
    // TODO remove any
    ethereum.on("connect", (provider: any) => chainChanged(provider.chainId));
    ethereum.on("accountsChanged", walletConnected);

    ethereum.autoRefreshOnNetworkChange = false;

    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      ethereum.request({ method: "eth_accounts" }).then(walletConnected);
    }
  }, []);

  const onClick = () => {
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      connectWallet();
    } else {
      // Set onboarding state?
      (new MetaMaskOnboarding()).startOnboarding();
    }
  }

  const address = selector(state => state.wallet.address)
  const chainID = selector(state => state.chainID.chainID)

  const getChainIndicator = (chainID: ChainID | null) => {
    switch(chainID) {
      case null:
        return null
      case ChainID.Hardhat:
        return <Tag type="magenta">{chainIDToName(chainID)}</Tag>
      case ChainID.Rinkeby:
        return <Tag type="teal">{chainIDToName(chainID)}</Tag>
    }
  }

  // onClose={() => setIsWalletModalOpen(false)}
  const modal =
    <WalletModal
      open={isWalletModalOpen}
      onRequestClose={() => setIsWalletModalOpen(false)}  
    />

  const button =
    address !== null
      ? <Button kind="secondary" size="small" onClick={() => setIsWalletModalOpen(true)}>
          {abbreviateAddress(address)}
        </Button>
      : <Button size="small" onClick={onClick}>
          Connect to a Wallet
        </Button>

  return <>
    {getChainIndicator(chainID)}
    {button}
    {modal}
    </>
}
