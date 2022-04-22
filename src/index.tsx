import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import { store } from './app/store'
import { Provider } from 'react-redux'
import * as serviceWorker from './serviceWorker'
import RawErrorBoundary from './components/library/RawErrorBoundary'

import { BrowserView, MobileView } from 'react-device-detect'
import MobileApp from './MobileApp'

import './App.css'
import './styles/night_app.scss'

declare global {
  interface Window {
    ethereum: any
  }
}

ReactDOM.render(
  <React.StrictMode>
    <RawErrorBoundary>
      <Provider store={store}>
        <App />
      </Provider>
    </RawErrorBoundary>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
