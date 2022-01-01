import { ReactNode } from 'react'
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

const tabToRender: {[key in Tab]: ReactNode} = {
  Positions: <Positions />,
  Lend: <Lend />,
  Withdraw: <Withdraw />,
  Liquidity: <Liquidity />,
  Transactions: <RecentTransactions />,
}

function App() {
  return (
    <ErrorBoundary>
      <HashRouter>
        <PageHeader />
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
      </HashRouter>
      <Notifications />
      <LocalStorageManager />
    </ErrorBoundary>
  );
}

export default App
