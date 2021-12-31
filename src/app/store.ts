import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'

import positionsReducer from '../slices/positions'
import poolsMetadataReducer from '../slices/poolsMetadata'
import poolsCurrentDataReducer from '../slices/poolsCurrentData'
import liquidityPositionsReducer from '../slices/liquidityPositions'
import chainIDReducer from '../slices/chainID'
import transactionsReducer from '../slices/transactions'
import walletReducer from '../slices/wallet'
import systemDebtReducer from '../slices/systemDebt'
import uniswapContractsReducer from '../slices/uniswapContracts'

import governorReducer from '../slices/governor'
import liquidationsReducer from '../slices/liquidations'
import marketReducer from '../slices/market'
import pricesReducer from '../slices/prices'
import rewardsReducer from '../slices/rewards'
import ratesReducer from '../slices/rates'

import balancesReducer from '../slices/balances'

import contractsReducer from '../slices/contracts'
import notificationsReducer from '../slices/notifications'

export const store = configureStore({
  reducer: {
    positions: positionsReducer,
    poolsMetadata: poolsMetadataReducer,
    poolsCurrentData: poolsCurrentDataReducer,
    liquidityPositions: liquidityPositionsReducer,
    chainID: chainIDReducer,
    transactions: transactionsReducer,
    wallet: walletReducer,
    systemDebt: systemDebtReducer,
    uniswapContracts: uniswapContractsReducer,

    governor: governorReducer,
    liquidations: liquidationsReducer,
    market: marketReducer,
    prices: pricesReducer,
    rewards: rewardsReducer,
    rates: ratesReducer,

    balances: balancesReducer,

    contracts: contractsReducer,
    notifications: notificationsReducer,
  },
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>
