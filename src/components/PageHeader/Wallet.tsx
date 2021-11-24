import { useEffect, useState } from "react"
import { useHistory } from 'react-router-dom'
import MetaMaskOnboarding from "@metamask/onboarding"
import { Button, InlineLoading } from 'carbon-components-react'
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import { store } from '../../app/store'
import { chainIDFound } from '../../slices/chainID'
import { abbreviateAddress } from '../../utils'
import { getSortedUserTxs } from '../utils'
import ConnectWalletButton from '../utils/ConnectWalletButton'
import { getWalletConnectedFunction } from '../utils/WalletConnection'
import { TransactionStatus } from '../../slices/transactions'
import { clearEphemeralStorage } from '../utils/LocalStorageManager'
import { getChainIDFromState } from '../../slices/chainID/index';
import { getEtherscanAddressLink } from '../utils/ExplorerLink';

const Wallet = () => {
  const dispatch = useAppDispatch()
  const history = useHistory()
  const address = selector(state => state.wallet.address)
  const chainID = getChainIDFromState(selector(state => state.chainID))
  const txs = selector(state => state.transactions)

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
        clearEphemeralStorage()
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
    getSortedUserTxs(chainID, address, txs)
      .filter(tx => tx.status === TransactionStatus.Pending)
      .length

  return (
    address !== null && chainID !== null
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
          : <Button
              kind="secondary"
              size="small"
              onClick={() => window.open(getEtherscanAddressLink(address, chainID), '_blank')}>
              {abbreviateAddress(address)}
            </Button>
        )
      : <ConnectWalletButton small />
  )
}

export default Wallet
