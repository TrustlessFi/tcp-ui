import { useEffect } from "react"
import { useHistory } from 'react-router-dom'
import MetaMaskOnboarding from "@metamask/onboarding"
import { Button, InlineLoading } from 'carbon-components-react'
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import { store } from '../../app/store'
import { chainIDFound } from '../../slices/chainID'
import { appInitialized } from '../../slices/wallet'
import { chainIDFoundForRootContracts } from '../../slices/rootContracts'
import { getSortedUserTxs } from '../library'
import ConnectWalletButton from '../library/ConnectWalletButton'
import { TransactionStatus } from '../../slices/transactions'
import WalletButton from '../library/WalletButton'
import SwitchNetworkButton from '../library/SwitchNetworkButton'
import { AppDispatch } from '../../app/store'
import { walletConnected } from '../../slices/wallet'
import { userAddressFound } from '../../slices/userAddress'
import { equalStringsCaseInsensitive, reloadPage } from '../../utils'
import allSlices from '../../slices/allSlices'
import { SliceDataType, CacheDuration } from '../../slices/'
import waitFor from '../../slices/waitFor'
import { setTab } from '../../slices/tabs'
import { Tab, tabToPath } from '../../App'
import { cacheIndex } from '../../slices/cacheBreaker'

export const clearUserData = (dispatch: AppDispatch) =>
  Object.values(allSlices)
    .filter(slice => slice.sliceType === SliceDataType.ChainUserData || slice.sliceType === SliceDataType.LocalUserData)
      .map(slice => dispatch(slice.slice.actions.clearData()))

export const clearEphemeralStorage = () =>
  Object.values(allSlices)
    .filter(slice => slice.cacheDuration !== CacheDuration.INFINITE)
      .map(slice => localStorage.removeItem(slice.name))

export const clearAllStorage = (dispatch: AppDispatch) =>
  Object.values(allSlices)
    .map(slice => dispatch(slice.slice.actions.clearData()))

export const getWalletConnectedFunction = (dispatch: AppDispatch) => (accounts: string[]) => {
  const account = accounts.length > 0 ? accounts[0] : null
  const currentAccount = store.getState().userAddress

  if (currentAccount === null && account === null) return
  if (currentAccount !== null && account !== null && equalStringsCaseInsensitive(currentAccount, account)) return

  dispatch(walletConnected())
  dispatch(userAddressFound(account))

  clearUserData(dispatch)
  dispatch(appInitialized())
}

const Wallet = () => {
  const dispatch = useAppDispatch()
  const history = useHistory()

  const {
    chainID,
    wallet,
    userAddress,
    transactions,
    cacheBreaker,
  } = waitFor([
    'chainID',
    'wallet',
    'userAddress',
    'transactions',
    'cacheBreaker',
  ], selector, dispatch)

  if (cacheBreaker.cacheIndex !== cacheIndex) {
    localStorage.clear()
    clearAllStorage(dispatch)
  }

  const walletConnected = getWalletConnectedFunction(dispatch)

  const chainChanged = (newChainID: number | string | null) => {
    // Transform type to `number | null`.
    if (typeof newChainID === 'string') newChainID = parseInt(newChainID)

    // Return if chainID did not change.
    if (newChainID === store.getState().chainID) return

    if (newChainID === null) {
      clearUserData(dispatch)
      clearEphemeralStorage()
      reloadPage()
    } else {
      dispatch(chainIDFound(newChainID))
      dispatch(chainIDFoundForRootContracts(newChainID))
      dispatch(appInitialized())
      clearUserData(dispatch)
      clearEphemeralStorage()
    }
  }

  useEffect(() => {
    const { ethereum } = window
    if (!ethereum) return
    if (!MetaMaskOnboarding.isMetaMaskInstalled()) return

    ethereum.request({ method: 'eth_chainId' }).then(chainChanged)
    ethereum.request({ method: "eth_accounts" }).then(walletConnected)

    ethereum.on('chainChanged', chainChanged)
    ethereum.on('accountsChanged', walletConnected)
    ethereum.on('connect', (provider: any) => chainChanged(provider.chainId))

    ethereum.autoRefreshOnNetworkChange = false
  })

  const countPendingTxs =
    getSortedUserTxs(chainID, userAddress, transactions)
      .filter(tx => tx.status === TransactionStatus.Pending)
      .length

  if (countPendingTxs > 0) {
    return <Button
      size='sm'
      onClick={() => {
        history.push(tabToPath(Tab.Transactions))
        dispatch(setTab(Tab.Transactions))
      }}
      style={{paddingLeft: 12, paddingRight: 24, paddingBottom: 0, paddingTop: 0}}>
      <div style={{whiteSpace: 'nowrap', paddingRight: 12}}>
        {countPendingTxs} Pending
      </div>
      <InlineLoading />
    </Button>
  }

  if (chainID === null && wallet.initialized) return <SwitchNetworkButton size='sm' />
  if (userAddress === null || chainID === null) return <ConnectWalletButton size='sm' />

  return (
    <WalletButton />
  )
}

export default Wallet
