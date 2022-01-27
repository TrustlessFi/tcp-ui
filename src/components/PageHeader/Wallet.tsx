import { useEffect } from "react"
import { useHistory } from 'react-router-dom'
import MetaMaskOnboarding from "@metamask/onboarding"
import { Button, InlineLoading } from 'carbon-components-react'
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import { store } from '../../app/store'
import { chainIDFound } from '../../slices/chainID'
import { chainIDFoundForRootContracts } from '../../slices/rootContracts'
import { getSortedUserTxs } from '../library'
import ConnectWalletButton from '../library/ConnectWalletButton'
import { TransactionStatus } from '../../slices/transactions'
import WalletButton from '../library/WalletButton'
import { AppDispatch } from '../../app/store'
import { walletConnected } from '../../slices/wallet'
import { userAddressFound } from '../../slices/userAddress'
import { equalStringsCaseInsensitive } from '../../utils/index';
import allSlices from '../../slices/allSlices'
import { SliceDataType, CacheDuration } from '../../slices/'

export const clearUserData = (dispatch: AppDispatch) =>
  Object.values(allSlices)
    .filter(slice => slice.sliceType === SliceDataType.ChainUserData)
      .map(slice => dispatch(slice.slice.actions.clearData()))

export const clearEphemeralStorage = () =>
  Object.values(allSlices)
    .filter(slice => slice.cacheDuration !== CacheDuration.INFINITE)
      .map(slice => localStorage.removeItem(slice.name))


export const getWalletConnectedFunction = (dispatch: AppDispatch) => (accounts: string[]) => {
  const account = accounts.length > 0 ? accounts[0] : null
  const currentAccount = store.getState().userAddress

  if (currentAccount === null && account === null) return
  if (currentAccount !== null && account !== null && equalStringsCaseInsensitive(currentAccount, account)) return

  dispatch(walletConnected())
  dispatch(userAddressFound(account))

  clearUserData(dispatch)
}

const Wallet = () => {
  const dispatch = useAppDispatch()
  const history = useHistory()

  const userAddress = selector(state => state.userAddress)
  const chainID = selector(state => state.chainID)
  const txs = selector(state => state.transactions)

  const walletConnected = getWalletConnectedFunction(dispatch)

  const chainChanged = (chainID: number | string) => {
    const getCurrentChainID = () => store.getState().chainID

    if (typeof chainID === 'string') chainID = parseInt(chainID)

    const currentChainID = getCurrentChainID()

    if (currentChainID !== chainID) {
      if (currentChainID === null) {
        dispatch(chainIDFound(chainID))
        dispatch(chainIDFoundForRootContracts(chainID))
      } else {
        clearEphemeralStorage()
        window.location.reload()
      }
    }
  }

  useEffect(() => {
    const { ethereum } = window
    if (!ethereum) return
    // TODO if metamask not installed return

    ethereum.request({ method: 'eth_chainId' }).then(chainChanged)

    ethereum.on('chainChanged', chainChanged)
    // TODO remove any
    ethereum.on('connect', (provider: any) => chainChanged(provider.chainId))
    ethereum.on('accountsChanged', walletConnected)

    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      ethereum.request({ method: "eth_accounts" }).then(walletConnected)
    }

    ethereum.autoRefreshOnNetworkChange = false

  })

  const countPendingTxs =
    getSortedUserTxs(chainID, userAddress, txs)
      .filter(tx => tx.status === TransactionStatus.Pending)
      .length

  return (
    userAddress !== null && chainID !== null
      ? (countPendingTxs > 0
          ? <Button
              size="small"
              onClick={() => history.push('/transactions/')}
              style={{paddingLeft: 12, paddingRight: 24, paddingBottom: 0, paddingTop: 0}}>
              <div style={{whiteSpace: 'nowrap', paddingRight: 12}}>
                {countPendingTxs} Pending
              </div>
              <InlineLoading />
            </Button>
          : <WalletButton
              address={userAddress}
              style={{height: 32, backgroundColor: "#FFFFFF", color: "#000000"}} />
        )
      : <ConnectWalletButton size="sm" />
  )
}

export default Wallet
