import { ReactNode, FunctionComponent, useEffect } from 'react'
import { useAppDispatch, useAppSelector as selector } from './app/hooks'
import { getNullableProvider, provider } from './utils/getProvider'
import PageHeader from './components/PageHeader'
import Positions from './components/Positions'
import Stake from './components/Stake/'
import RecentTransactions from './components/RecentTransactions'
import ErrorBoundary from './components/library/ErrorBoundary'
import Liquidity from './components/Liquidity'
import { Switch, Route, HashRouter } from "react-router-dom"
import LocalStorageManager from './components/library/LocalStorageManager'
import Notifications from './components/Notifications'
import SwitchNetwork from './components/SwitchNetwork'
import { TransactionStatus, waitForTransaction } from './slices/transactions'
import { getSortedUserTxs } from './components/library'
import waitFor from './slices/waitFor'

import './App.css'
import './styles/night_app.scss'

declare global {
  interface Window {
    ethereum: any
  }
}

export enum Tab {
  Borrow = 'Borrow',
  Stake = 'Stake',
  Liquidity = 'Liquidity',
  Transactions = 'Transactions',
}

export const tabDisplay: { [key in Tab]?: string } = {
}

const tabToRender: {[key in Tab]: ReactNode} = {
  Borrow: <Positions />,
  Stake: <Stake />,
  Liquidity: <Liquidity />,
  Transactions: <RecentTransactions />,
}

const App: FunctionComponent<{}> = () => {
  const dispatch = useAppDispatch()

  const {
    chainID,
    userAddress,
    transactions,
  } = waitFor([
    'chainID',
    'userAddress',
    'transactions',
  ], selector, dispatch)

  const userTxs =
    getSortedUserTxs(chainID, userAddress, transactions)
      .filter(tx => tx.status === TransactionStatus.Pending)

  const fetchTransactions = (provider: provider) =>
    Promise.all(userTxs.map(tx => waitForTransaction(tx, provider, dispatch)))

  useEffect(() => {
    if (userTxs.length === 0) return
    const provider = getNullableProvider()
    if (provider === null) return
    fetchTransactions(provider)
  }, [userTxs])

  return (
    <div style={{minWidth: 550}}>
      <ErrorBoundary>
        <HashRouter>
          <div style={{padding: 48 }}>
          <PageHeader />
          <SwitchNetwork>
              <Switch>
                {Object.values(Tab).map((tab, index) => {
                  const path = '/' + tab.toLowerCase()
                  const paths = index === 0 ? ['/', path] : [path]
                  return paths.map(path => (
                    <Route exact={path === '/'} path={path} key={path}>
                      {tabToRender[tab]}
                    </Route>
                  ))
                })}
              </Switch>
          </SwitchNetwork>
            </div>
        </HashRouter>
        <Notifications />
        <LocalStorageManager />
      </ErrorBoundary>
    </div>
  )
}

export default App
