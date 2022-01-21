import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { getLocalStorageState } from '../'

export enum WalletToken {
  Hue = 'Hue',
  LendHue = 'LendHue',
  TCP = 'TCP',
}

export type tokensAddedToWalletState = {
  [token in WalletToken]: {
    [chainID in number]: {
      [address in string]: boolean
    }
  }
}

const initialState: tokensAddedToWalletState = {
  [WalletToken.Hue]: {},
  [WalletToken.LendHue]: {},
  [WalletToken.TCP]: {},
}

interface walletTokenID {
  walletToken: WalletToken
  address: string
  chainID: number
}

const name = 'tokensAddedToWallet'

export const tokensAddedToWalletSlice = createSlice({
  name,
  initialState: getLocalStorageState(name, initialState) as tokensAddedToWalletState,
  reducers: {
    tokenAddedToWallet: (state, action: PayloadAction<walletTokenID>) => {
      if (state[action.payload.walletToken][action.payload.chainID] === undefined) {
        state[action.payload.walletToken][action.payload.chainID] = {[action.payload.address]: true}
      } else {
        state[action.payload.walletToken][action.payload.chainID][action.payload.address] = true
      }
    },
  }
})

export const { tokenAddedToWallet } = tokensAddedToWalletSlice.actions

export default tokensAddedToWalletSlice.reducer
