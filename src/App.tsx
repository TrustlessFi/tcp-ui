import React from 'react'
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

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <PageHeader />
        <div style={{marginTop: 47, padding: 48 }}>
          <Switch>
            <Route exact path={['/', '/positions']}>
              <Positions />
            </Route>
            <Route path={'/lend'}>
              <Lend />
            </Route>
            <Route path={'/liquidity'}>
              <LiquidityPositions />
            </Route>
            <Route path={'/governance'}>
              <Governance />
            </Route>
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
