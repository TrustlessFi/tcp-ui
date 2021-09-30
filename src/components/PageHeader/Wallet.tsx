import { useEffect, useState } from "react"
import MetaMaskOnboarding from "@metamask/onboarding"
import { Button, InlineLoading } from 'carbon-components-react'
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import { store } from '../../app/store'
import { chainIDFound } from '../../slices/chainID'
import { abbreviateAddress } from '../../utils'
import WalletModal from './WalletModal'
import { getSortedUserTxs } from '../utils'
import ConnectWalletButton from '../utils/ConnectWalletButton'
import { getWalletConnectedFunction } from '../utils/WalletConnection'
import { TransactionStatus } from '../../slices/transactions'

const Wallet = () => {
  const dispatch = useAppDispatch()
  const address = selector(state => state.wallet.address)
  const txs = selector(state => state.transactions)
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false)

  const walletConnected = getWalletConnectedFunction(dispatch)

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

  useEffect(() => {
    const { ethereum } = window
    if (!ethereum) return

    ethereum.request({ method: 'eth_chainId' }).then(chainChanged)

    ethereum.on('chainChanged', chainChanged)
    // TODO remove any
    ethereum.on('connect', (provider: any) => chainChanged(provider.chainId))
    ethereum.on('accountsChanged', walletConnected)

    ethereum.autoRefreshOnNetworkChange = false

    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      ethereum.request({ method: "eth_accounts" }).then(walletConnected)
    }
  })

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
      : <ConnectWalletButton mini />

  return (
    <>
      {button}
      {isWalletModalOpen ? modal : null}
    </>
  )
}

export default Wallet
