import { useEffect, useState } from "react"
import MetaMaskOnboarding from "@metamask/onboarding"
import { Button } from 'carbon-components-react'
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import { store } from '../../app/store'
import { connected, connectionFailed, connecting } from '../../slices/wallet'
import { chainIDFound } from '../../slices/chainID'
import { abbreviateAddress, equalStrings, equalStringsCaseInsensitive } from '../../utils'
import WalletModal from './WalletModal'
import NetworkIndicator from '../library/NetworkIndicator'
import { getSortedUserTxs } from '../utils'
import { toChecksumAddress } from '../../utils'
import { TransactionStatus } from '../../slices/transactions'
import { clearPositions } from '../../slices/positions'


const Wallet = () => {
  const dispatch = useAppDispatch()

  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false)

  const chainChanged = (chainID: number | string) => {

    // also refetch some of the accounts if the chain has changed from something valid to something valid
    // can probalby combine some logic with wallet connected

    const getCurrentChainID = () => {
      const id = store.getState().chainID.chainID
      const unknownID = store.getState().chainID.unknownChainID

      if (id !== null) return id
      if (unknownID !== null) return unknownID
      return null
    }

    if (typeof chainID === 'string') chainID = parseInt(chainID)

    const currentChainID = getCurrentChainID()

    if (currentChainID !== chainID) {
      if (currentChainID === null) {
        dispatch(chainIDFound(chainID))
      } else {
        window.localStorage.clear()
        window.location.reload()
      }
    }
  }

  const walletConnected = (accounts: string[]) => {
    // TODO if new account is different than the current account, and the current account isn't null
    // then clear all of the slices that depend on the user data
    const account = accounts && accounts[0]

    if (account != null) {
      const currentAccount = store.getState().wallet.address
      if (currentAccount === null || !equalStringsCaseInsensitive(currentAccount, account)) {
        dispatch(connected(toChecksumAddress(account)))
        dispatch(clearPositions())
      }
    }
  }

  const connectWallet = async () => {
    dispatch(connecting())

    return window.ethereum
      .request({ method: 'eth_requestAccounts' })
      .then(walletConnected)
      .catch((error: {code: number, message: string}) => {
        switch (error.code) {
          case 4001:
            console.error({
              content: 'Connection Rejected.',
              kind: 'warning'
            })
            break
          default:
            console.error({
              content: `Encountered unexpected error ${error.code}:${error.message}. Check console or try again.`,
              kind: 'error'
            })
        }

        dispatch(connectionFailed())
      })
  }

  useEffect(() => {
    const { ethereum } = window
    if (!ethereum) return

    ethereum.request({ method: "eth_chainId" }).then(chainChanged)

    ethereum.on("chainChanged", chainChanged)
    // TODO remove any
    ethereum.on("connect", (provider: any) => chainChanged(provider.chainId))
    ethereum.on("accountsChanged", walletConnected)

    ethereum.autoRefreshOnNetworkChange = false

    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      ethereum.request({ method: "eth_accounts" }).then(walletConnected)
    }
  })

  const onClick = () => {
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      connectWallet()
    } else {
      // Set onboarding state?
      (new MetaMaskOnboarding()).startOnboarding()
    }
  }

  const address = selector(state => state.wallet.address)
  const txs = selector(state => state.transactions)

  const countPendingTxs =
    getSortedUserTxs(address, txs)
      .filter(tx => tx.status === TransactionStatus.Pending)
      .length

  const modal =
    <WalletModal
      open={isWalletModalOpen}
      onRequestClose={() => setIsWalletModalOpen(false)}
    />

  const button =
    address !== null
      ? (countPendingTxs > 0
          ? <Button size="small" onClick={() => setIsWalletModalOpen(true)}>
              {countPendingTxs} Pending
            </Button>
          : <Button kind="secondary" size="small" onClick={() => setIsWalletModalOpen(true)}>
              {abbreviateAddress(address)}
            </Button>
        )
      : <Button size="small" onClick={onClick}>
          Connect to a Wallet
        </Button>

  return <>
    <NetworkIndicator />
    {button}
    {isWalletModalOpen ? modal : null}
    </>
}

export default Wallet
