import { ReactNode, FunctionComponent, useEffect } from 'react'
import { useAppDispatch, useAppSelector as selector } from './app/hooks'
import getProvider from './utils/getProvider'
import PageHeader from './components/PageHeader'
import Positions from './components/Positions'
import Lend from './components/Lend/Lend'
import Withdraw from './components/Lend/Withdraw'
import RecentTransactions from './components/RecentTransactions'
import ErrorBoundary from './components/library/ErrorBoundary'
import Liquidity from './components/Liquidity'
import { Switch, Route, HashRouter } from "react-router-dom"
import LocalStorageManager from './components/library/LocalStorageManager'
import Notifications from './components/Notifications'
import SwitchNetwork from './components/SwitchNetwork'
import { TransactionStatus, checkTransaction } from './slices/transactions'

import './App.css'
import './styles/night_app.scss'

declare global {
  interface Window {
    ethereum: any
  }
}

export enum Tab {
  Positions = 'Positions',
  Lend = 'Lend',
  Withdraw = 'Withdraw',
  Liquidity = 'Liquidity',
  Transactions = 'Transactions',
}

export const tabDisplay: { [key in Tab]?: string } = {
}

const tabToRender: {[key in Tab]: ReactNode} = {
  Positions: <Positions />,
  Lend: <Lend />,
  Withdraw: <Withdraw />,
  Liquidity: <Liquidity />,
  Transactions: <RecentTransactions />,
}

const App: FunctionComponent<{}> = () => {
  const dispatch = useAppDispatch()
  const transactions = selector(state => state.transactions)
  const provider = getProvider()

  useEffect(() => {
    const fetchTransactions = () => 
      Promise.all(
        Object.values(transactions)
          .filter(tx => tx.status === TransactionStatus.Pending)
          .map(tx => checkTransaction(tx, provider, dispatch))
      )

    fetchTransactions()
  }, [])


  return (
    <ErrorBoundary>
      <HashRouter>
        <PageHeader />
        <SwitchNetwork>
          <div style={{marginTop: 47, padding: 48 }}>
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
          </div>
        </SwitchNetwork>
      </HashRouter>
      <Notifications />
      <LocalStorageManager />
    </ErrorBoundary>
  )
}

export default App
