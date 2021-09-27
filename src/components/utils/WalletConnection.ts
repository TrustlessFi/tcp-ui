import { AppDispatch, store } from '../../app/store'
import { connected, connectionFailed, connecting } from '../../slices/wallet'
import { equalStringsCaseInsensitive , toChecksumAddress } from '../../utils/index';
import { clearUserData } from './index';


export const getWalletConnectedFunction = (dispatch: AppDispatch) => (accounts: string[]) => {
  const account = accounts.length > 0 ? accounts[0] : null
  const currentAccount = store.getState().wallet.address

  if (currentAccount === null && account === null) return
  if (currentAccount !== null && account !== null && equalStringsCaseInsensitive(currentAccount, account)) return

  dispatch(connected(account === null ? null : toChecksumAddress(account)))

  clearUserData(dispatch)
}

export const connectWallet = async (dispatch: AppDispatch) => {
  dispatch(connecting())

  const walletConnected = getWalletConnectedFunction(dispatch)

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
