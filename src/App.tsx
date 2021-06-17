import React from 'react'
import PageHeader from './components/PageHeader'
import Positions from './components/Positions'
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
    <Router>
      <PageHeader />
      <div style={{marginTop: 47, padding: 48 }}>
        <Switch>
          <Route exact path={['/', '/positions']}>
            <Positions />
          </Route>
          <Route path={'/liquidity'}>
            <LiquidityPositions />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
