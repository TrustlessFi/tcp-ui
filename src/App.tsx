import React, { ReactNode } from 'react'
import PageHeader from './components/PageHeader'
import Positions from './components/Positions'
import Lend from './components/Lend'
import Governance from './components/Governance'
import ErrorBoundary from './components/library/ErrorBoundary'
import LiquidityPositions from './components/LiquidityPositions'
import { Switch, Route } from "react-router-dom"
import { BrowserRouter as Router } from "react-router-dom"
import LocalStorageManager from './components/utils/LocalStorageManager'
import AppModal from './components/AppModal'
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
  Liquidity = 'Liquidity',
  Governance = 'Governance',
}

const tabToRender: {[key in Tab]: ReactNode} = {
  Positions: <Positions />,
  Lend: <Lend />,
  Liquidity: <LiquidityPositions />,
  Governance: <Governance />,
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <PageHeader />
        <div style={{marginTop: 47, padding: 48 }}>
          <Switch>
            {Object.values(Tab).map((tab, index) => {
              const path = '/' + tab.toLowerCase()
              const paths = index === 0 ? ['/', path] : [path]
              return (
                <Route exact={index === 0} path={paths} key={tab}>
                  {tabToRender[tab]}
                </Route>
              )
            })}
          </Switch>
        </div>
      </Router>
      <Notifications />
      <LocalStorageManager />
      <AppModal />
    </ErrorBoundary>
  );
}

export default App
