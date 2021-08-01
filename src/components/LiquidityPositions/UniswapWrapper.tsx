import React, { Suspense, useEffect } from 'react';
import { createWeb3ReactRoot, useWeb3React, Web3ReactProvider } from '@web3-react/core'
import { InjectedConnector } from '@web3-react/injected-connector';
import { Provider } from 'react-redux'
import { ethers } from 'ethers';

import { useAppSelector as selector } from '../../app/hooks';
import '../uniswap/src/i18n';
import ApplicationUpdater from '../uniswap/src/state/application/updater';
import MulticallUpdater from '../uniswap/src/state/multicall/updater';
import TransactionUpdater from '../uniswap/src/state/transactions/updater';
import ThemeProvider from '../uniswap/src/theme';
import store from '../uniswap/src/state';

createWeb3ReactRoot('NETWORK');

const injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42, 1337],
});

interface UniswapWrapperProps {
  children: React.ReactNode,
}

const getLibrary = (provider: any, connector: any) => {
  return new ethers.providers.Web3Provider(provider, 'any');
};

const Web3Context = ({ children }: UniswapWrapperProps) => {
  const web3 = useWeb3React();
  const chainId = selector(state => state.chainID);

  useEffect(() => {

      if(chainId) {
        setTimeout(() => {
          try {
            web3.activate(injected, undefined, true);
          } catch (error) {
            console.error(error);
          }
        }, 2000)
      }
  }, [chainId, web3]);

  return <>{children}</>;
};

const UniswapWrapper = ({ children }: UniswapWrapperProps) => {
  return (
    <Suspense fallback={null}>
      <Web3ReactProvider getLibrary={getLibrary}>
        <Web3Context>
          <Provider store={store}>
            <ApplicationUpdater />
            <MulticallUpdater />
            <TransactionUpdater />
            <ThemeProvider>
              {children}
            </ThemeProvider>
          </Provider>
        </Web3Context>
      </Web3ReactProvider>
    </Suspense>
  );
};

export default UniswapWrapper;