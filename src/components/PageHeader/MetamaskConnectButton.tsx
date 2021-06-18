import React, { useEffect } from "react";
import MetaMaskOnboarding from "@metamask/onboarding";
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import { ReactComponent as MetamaskLogo } from "../../img/metamask.svg";
import { connected, connectionFailed, connecting } from '../../slices/wallet'
import { providerFound } from '../../slices/provider'
import { ethers } from 'ethers'

const MetamaskConnectButton = () => {
  const dispatch = useAppDispatch()

  const chainChanged = (chainID: number) => {
    // also refetch some of the accounts if the chain has changed from something valid to something valid
    // can probalby combine some logic with wallet connected

    dispatch(providerFound({chainID, provider: new ethers.providers.Web3Provider(window.ethereum)}))
  }

  const connectWallet = async () => {
    dispatch(connecting())

    console.log('connectWallet called')

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

  const isConnecting = selector(state => state.wallet.connecting)
  const address = selector(state => state.wallet.address)
  const connectingStyle = isConnecting ? 'connecting' : (address != null ? 'connected' : 'disconnected')
  console.log({isConnecting, address, connectingStyle})

  return (
    <>
      <MetamaskLogo onClick={onClick} className='metamask-connect-button' />
      <div className={`connect-status-indicator ${connectingStyle}`} />
    </>
  );
};

export default MetamaskConnectButton
