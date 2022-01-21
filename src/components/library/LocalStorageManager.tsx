import { useAppSelector as selector, } from '../../app/hooks'
import { Slice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store'
import { minutes, timeS } from '../../utils/'
import { transactionsSlice, TransactionState } from '../../slices/transactions'
import { contractsSlice, contractsInfo } from '../../slices/contracts'
import { liquidationsSlice } from '../../slices/liquidations'
import { marketSlice } from '../../slices/market'
import { pricesSlice } from '../../slices/prices'
import { ratesSlice } from '../../slices/rates'
import { rewardsSlice } from '../../slices/rewards'
import { positionsSlice } from '../../slices/positions'
import { balancesSlice } from '../../slices/balances'
import { uniswapContractsSlice, uniswapContractsInfo } from '../../slices/uniswapContracts'
import { poolsMetadataSlice } from '../../slices/poolsMetadata'
import { poolsCurrentDataSlice } from '../../slices/poolsCurrentData'
import { systemDebtSlice } from '../../slices/systemDebt'
import { notificationsSlice, notificationState } from '../../slices/notifications'
import { tokensAddedToWalletSlice, tokensAddedToWalletState } from '../../slices/tokensAddedToWallet'
import { rewardsInfo } from '../../slices/rewards'
import { liquidationsInfo } from '../../slices/liquidations'
import { poolsMetadata } from '../../slices/poolsMetadata'
import { marketInfo } from '../../slices/market'
import { balances } from '../../slices/balances'
import { positions } from '../../slices/positions'
import { poolsCurrentData } from '../../slices/poolsCurrentData'
import { pricesInfo } from '../../slices/prices'
import { ratesInfo } from '../../slices/rates'
import { sdi } from '../../slices/systemDebt'

type slicesState =
  TransactionState |
  contractsInfo |
  poolsMetadata |
  liquidationsInfo |
  marketInfo |
  balances |
  positions |
  poolsCurrentData |
  pricesInfo |
  ratesInfo |
  rewardsInfo |
  sdi |
  notificationState |
  uniswapContractsInfo |
  tokensAddedToWalletState |
  null

type persistedSlice = {
  slice: Slice,
  ttl: number,
  getState: (state: RootState) => slicesState
}

type persistedSlices = {
  [key in keyof RootState]?: persistedSlice
}

const NO_EXPIRATION = -1
const SHORT_EXPIRATION = minutes(1)
const LONG_EXPIRATION = minutes(30)

export const slicesToPersist: persistedSlices = {

  // Simple slices
  [notificationsSlice.name]: {
    slice: notificationsSlice,
    ttl: SHORT_EXPIRATION,
    getState: (state: RootState) => state.notifications
  },
  [transactionsSlice.name]: {
    slice: transactionsSlice,
    ttl: NO_EXPIRATION,
    getState: (state: RootState) => state.transactions
  },
  [tokensAddedToWalletSlice.name]: {
    slice: tokensAddedToWalletSlice,
    ttl: NO_EXPIRATION,
    getState: (state: RootState) => state.tokensAddedToWallet
  },

  // Slices with loadable state
  [contractsSlice.name]: {
    slice: contractsSlice,
    ttl: LONG_EXPIRATION,
    getState: (state: RootState) => state.contracts.value
  },
  [balancesSlice.name]: {
    slice: balancesSlice,
    ttl: SHORT_EXPIRATION,
    getState: (state: RootState) => state.balances.value
  },
  [positionsSlice.name]: {
    slice: positionsSlice,
    ttl: SHORT_EXPIRATION,
    getState: (state: RootState) => state.positions.value
  },
  [poolsCurrentDataSlice.name]: {
    slice: poolsCurrentDataSlice,
    ttl: SHORT_EXPIRATION,
    getState: (state: RootState) => state.poolsCurrentData.value
  },
  [balancesSlice.name]: {
    slice: balancesSlice,
    ttl: SHORT_EXPIRATION,
    getState: (state: RootState) => state.balances.value
  },
  [poolsMetadataSlice.name]: {
    slice: poolsMetadataSlice,
    ttl: LONG_EXPIRATION,
    getState: (state: RootState) => state.poolsMetadata.value
  },
  [liquidationsSlice.name]: {
    slice: liquidationsSlice,
    ttl: LONG_EXPIRATION,
    getState: (state: RootState) => state.liquidations.value
  },
  [systemDebtSlice.name]: {
    slice: systemDebtSlice,
    ttl: SHORT_EXPIRATION,
    getState: (state: RootState) => state.systemDebt.value
  },
  [pricesSlice.name]: {
    slice: pricesSlice,
    ttl: SHORT_EXPIRATION,
    getState: (state: RootState) => state.prices.value
  },
  [marketSlice.name]: {
    slice: marketSlice,
    ttl: SHORT_EXPIRATION,
    getState: (state: RootState) => state.market.value
  },
  [ratesSlice.name]: {
    slice: ratesSlice,
    ttl: LONG_EXPIRATION,
    getState: (state: RootState) => state.rates.value
  },
  [rewardsSlice.name]: {
    slice: rewardsSlice,
    ttl: LONG_EXPIRATION,
    getState: (state: RootState) => state.rewards.value
  },
  [uniswapContractsSlice.name]: {
    slice: uniswapContractsSlice,
    ttl: LONG_EXPIRATION,
    getState: (state: RootState) => state.uniswapContracts.value
  },
}

const LocalStorageManager = () => {
  for (const [key, slice] of Object.entries(slicesToPersist)) {
    const sliceState = selector(slice.getState)
    if (sliceState === null) continue
    const year2120 = 4733539200
    const ttl = slice.ttl
    const expiration = ttl === NO_EXPIRATION ? year2120 : timeS() + ttl
    const stateWithTimestamp: {expiration: number, sliceState: unknown} = { expiration, sliceState }
    localStorage.setItem(key, JSON.stringify(stateWithTimestamp))
  }
  return <></>
}

const permanentLocalStorage: string[] = [
  transactionsSlice.name,
]

export const clearEphemeralStorage = () => {
  Object.keys(slicesToPersist)
    .filter(sliceName => !permanentLocalStorage.includes(sliceName))
    .map(sliceName => localStorage.removeItem(sliceName))
}

export default LocalStorageManager
