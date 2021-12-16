import { useAppSelector as selector, } from '../../app/hooks'
import { Slice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store'
import { minutes, timeS } from '../../utils/'
import { transactionsSlice, TransactionState } from '../../slices/transactions'
import { contractsSlice, ContractsState } from '../../slices/contracts'
import { liquidationsSlice, liquidationsInfo } from '../../slices/liquidations'
import { marketSlice, marketInfo } from '../../slices/market'
import { pricesSlice, pricesInfo } from '../../slices/prices'
import { ratesSlice, ratesInfo } from '../../slices/rates'
import { positionsSlice, positionsInfo } from '../../slices/positions'
import { balancesSlice, balancesInfo } from '../../slices/balances'
import { uniswapContractsSlice, uniswapContractsInfo } from '../../slices/uniswapContracts'
import { poolsMetadataSlice, poolsMetadata } from '../../slices/poolsMetadata'
import { poolsCurrentDataSlice, poolsCurrentInfo } from '../../slices/poolsCurrentData'
import { systemDebtSlice, systemDebtInfo } from '../../slices/systemDebt'
import { notificationsSlice, NotificationState } from '../../slices/notifications'

type slicesState =
  TransactionState |
  ContractsState |
  poolsMetadata |
  liquidationsInfo |
  marketInfo |
  balancesInfo |
  positionsInfo |
  poolsCurrentInfo |
  pricesInfo |
  ratesInfo |
  systemDebtInfo |
  NotificationState |
  uniswapContractsInfo |
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
  [contractsSlice.name]: {
    slice: contractsSlice,
    ttl: LONG_EXPIRATION,
    getState: (state: RootState) => state.contracts
  },
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

  // Slices with loadable state
  [balancesSlice.name]: {
    slice: balancesSlice,
    ttl: SHORT_EXPIRATION,
    getState: (state: RootState) => state.balances.data.value
  },
  [positionsSlice.name]: {
    slice: positionsSlice,
    ttl: SHORT_EXPIRATION,
    getState: (state: RootState) => state.positions.data.value
  },
  [poolsCurrentDataSlice.name]: {
    slice: poolsCurrentDataSlice,
    ttl: SHORT_EXPIRATION,
    getState: (state: RootState) => state.poolsCurrentData.data.value
  },
  [balancesSlice.name]: {
    slice: balancesSlice,
    ttl: SHORT_EXPIRATION,
    getState: (state: RootState) => state.balances.data.value
  },
  [poolsMetadataSlice.name]: {
    slice: poolsMetadataSlice,
    ttl: LONG_EXPIRATION,
    getState: (state: RootState) => state.poolsMetadata.data.value
  },
  [liquidationsSlice.name]: {
    slice: liquidationsSlice,
    ttl: LONG_EXPIRATION,
    getState: (state: RootState) => state.liquidations.data.value
  },
  [systemDebtSlice.name]: {
    slice: systemDebtSlice,
    ttl: SHORT_EXPIRATION,
    getState: (state: RootState) => state.systemDebt.data.value
  },
  [pricesSlice.name]: {
    slice: pricesSlice,
    ttl: SHORT_EXPIRATION,
    getState: (state: RootState) => state.prices.data.value
  },
  [marketSlice.name]: {
    slice: marketSlice,
    ttl: SHORT_EXPIRATION,
    getState: (state: RootState) => state.market.data.value
  },
  [ratesSlice.name]: {
    slice: ratesSlice,
    ttl: LONG_EXPIRATION,
    getState: (state: RootState) => state.rates.data.value
  },
  [uniswapContractsSlice.name]: {
    slice: uniswapContractsSlice,
    ttl: LONG_EXPIRATION,
    getState: (state: RootState) => state.uniswapContracts.data.value
  },
}

const LocalStorageManager = () => {
  for (const [key, slice] of Object.entries(slicesToPersist)) {
    const sliceState = selector(slice.getState)
    if (sliceState === null) continue
    const year2120 = 4733539200
    const ttl = slice.ttl
    const expiration = ttl === NO_EXPIRATION ? year2120 : timeS() + ttl
    const stateWithTimestamp = { expiration, sliceState }
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
