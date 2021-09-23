import { useAppSelector as selector, } from '../../app/hooks'
import { Slice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store'
import { minutes, timeS } from '../../utils/'
import { transactionsSlice, TransactionState } from '../../slices/transactions'
import { positionsEditorSlice, PositionsEditorState } from '../../slices/positionsEditor'
import { contractsSlice, ProtocolContractsState } from '../../slices/contracts'
import { liquidationsSlice, liquidationsInfo } from '../../slices/liquidations'
import { marketSlice, marketInfo } from '../../slices/market'
import { pricesSlice, pricesInfo } from '../../slices/prices'
import { ratesSlice, ratesInfo } from '../../slices/rates'
import { systemDebtSlice, systemDebtInfo } from '../../slices/systemDebt'
import { notificationsSlice, NotificationState } from '../../slices/notifications'

type slicesState =
  TransactionState |
  PositionsEditorState |
  ProtocolContractsState |
  liquidationsInfo |
  marketInfo |
  pricesInfo |
  ratesInfo |
  systemDebtInfo |
  NotificationState |
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
const MEDIUM_EXPIRATION = minutes(5)
const LONG_EXPIRATION = minutes(30)

export const slicesToPersist: persistedSlices = {

  // Simple slices
  [transactionsSlice.name]: {
    slice: transactionsSlice,
    ttl: NO_EXPIRATION,
    getState: (state: RootState) => state.transactions
  },
  [positionsEditorSlice.name]: {
    slice: positionsEditorSlice,
    ttl: MEDIUM_EXPIRATION,
    getState: (state: RootState) => state.positionsEditor
  },
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

  // Slices with loadable state
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
}

type sliceStateWithExpiration = { expiration: number, sliceState: slicesState }

const LocalStorageManager = () => {
  for (const [key, slice] of Object.entries(slicesToPersist)) {
    const sliceState = selector(slice!.getState)
    if (sliceState === null) continue
    const ttl = slice!.ttl
    const year2120 = 4733539200
    const expiration = ttl === NO_EXPIRATION ? year2120 : timeS() + slice!.ttl
    const stateWithTimestamp: sliceStateWithExpiration = { expiration, sliceState }
    localStorage.setItem(key, JSON.stringify(stateWithTimestamp))
  }
  return <></>
}

export default LocalStorageManager
