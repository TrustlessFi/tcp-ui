import React from 'react'
import PageHeader from './components/PageHeader'
import TxConfirmModal from './components/Write/TxConfirmModal'
import Positions from './components/Positions'
import Governance from './components/Governance'
import ErrorBoundary from './components/library/ErrorBoundary'
import LiquidityPositions from './components/LiquidityPositions'
import { Switch, Route } from "react-router-dom"
import { BrowserRouter as Router } from "react-router-dom"

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
        <TxConfirmModal />
        <div style={{marginTop: 47, padding: 48 }}>
          <Switch>
            <Route exact path={['/', '/positions']}>
              <Positions />
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
    </ErrorBoundary>
  );
}

export default App
