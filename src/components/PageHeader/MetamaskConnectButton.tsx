import React, { Component, useEffect } from "react";
import MetaMaskOnboarding from "@metamask/onboarding";

import { ReactComponent as MetamaskLogo } from "../../img/metamask.svg";

type WalletState = {connecting: boolean, address: string}

const chainChanged = (chainId: number) => console.log(chainId)

const onboarding = new MetaMaskOnboarding();

interface MetamaskConnectButtonProps {
  wallet: WalletState;
}

// TODO remove any
const onConnect = (accounts: any) => {
  console.log({accounts})
  // walletConnected(accounts);
  // getBalances();
};
const connectWallet = () => console.log("connect wallet called")

const MetamaskConnectButton = ({ wallet }: MetamaskConnectButtonProps) => {
  useEffect(() => {
    const { ethereum } = window;

    if (!ethereum) {
      return;
    }

    ethereum.request({ method: "eth_chainId" }).then(chainChanged);

    ethereum.on("chainChanged", chainChanged);
// TODO remove any
    ethereum.on("connect", (provider: any) => chainChanged(provider.chainId));
    ethereum.on("accountsChanged", onConnect);

    ethereum.autoRefreshOnNetworkChange = false;

    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      ethereum.request({ method: "eth_accounts" }).then(onConnect);
    }
  }, []);

  const onClick = () => {
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      // Set connecting state?
      connectWallet();
    } else {
      // Set onboarding state?
      onboarding.startOnboarding();
    }
  };

  let indicatorClass;

  if (wallet.connecting) {
    indicatorClass = "connecting";
  } else if (wallet.address) {
    indicatorClass = "connected";
  }

  return (
    <>
      <MetamaskLogo />
      <div className={`connect-status-indicator ${indicatorClass}`} />
    </>
  );
};

export default MetamaskConnectButton;
