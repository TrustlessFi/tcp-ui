import { useEffect, useState } from "react"
import MetaMaskOnboarding from "@metamask/onboarding"
import { Button, InlineLoading } from 'carbon-components-react'
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import { store } from '../../app/store'
import { connected, connectionFailed, connecting } from '../../slices/wallet'
import { chainIDFound } from '../../slices/chainID'
import { abbreviateAddress, equalStrings, equalStringsCaseInsensitive } from '../../utils'
import WalletModal from './WalletModal'
import { getSortedUserTxs, clearUserData } from '../utils'
import { toChecksumAddress } from '../../utils'
import { TransactionStatus } from '../../slices/transactions'

const Wallet = () => {
  const dispatch = useAppDispatch()

  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false)

  const chainChanged = (chainID: number | string) => {

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
    const account = accounts.length > 0 ? accounts[0] : null
    const currentAccount = store.getState().wallet.address

    if (currentAccount === null && account === null) return
    if (currentAccount !== null && account !== null && equalStringsCaseInsensitive(currentAccount, account)) return

    dispatch(connected(account === null ? null : toChecksumAddress(account)))

    clearUserData(dispatch)
  }

  const connectWallet = async () => {
    dispatch(connecting())

    return window.ethereum
      .request({ method: 'eth_requestAccounts' })
      .then(walletConnected)
      .catch((error: {code: number, message: string}) => {
        switch (error.code) {
          case 4001:
            console.warn('Wallet connection rejected by user.')
            break
          default:
            console.error(`Encountered unexpected error ${error.code}: '${error.message}'.`)
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
          ? <Button size="small" onClick={() => setIsWalletModalOpen(true)} style={{paddingLeft: 12, paddingRight: 24, paddingBottom: 0, paddingTop: 0}}>
              <div style={{whiteSpace: 'nowrap', paddingRight: 12}}>
                {countPendingTxs} Pending
              </div>
              <InlineLoading />
            </Button>
          : <Button kind="secondary" size="small" onClick={() => setIsWalletModalOpen(true)}>
              {abbreviateAddress(address)}
            </Button>
        )
      : <Button size="small" onClick={onClick}>
          Connect to a Wallet
        </Button>

  return (
    <>
      {button}
      {isWalletModalOpen ? modal : null}
    </>
  )
}

export default Wallet
