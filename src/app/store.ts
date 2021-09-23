import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'

import positionsReducer from '../slices/positions'
import poolsReducer from '../slices/pools'
import liquidityPositionsReducer from '../slices/liquidityPositions'
import proposalsReducer from '../slices/proposals'
import chainIDReducer from '../slices/chainID'
import transactionsReducer from '../slices/transactions'
import walletReducer from '../slices/wallet'
import systemDebtReducer from '../slices/systemDebt'
import positionsEditorReducer from '../slices/positionsEditor'
import referenceTokensReducer from '../slices/referenceTokens'

import governorReducer from '../slices/governor'
import liquidationsReducer from '../slices/liquidations'
import marketReducer from '../slices/market'
import pricesReducer from '../slices/prices'
import ratesReducer from '../slices/rates'

import ethBalanceReducer from '../slices/ethBalance'
import hueBalanceReducer from '../slices/balances/hueBalance'
import lendHueBalanceReducer from '../slices/balances/lendHueBalance'
import referenceTokenBalancesReducer from '../slices/balances/referenceTokenBalances'

import contractsReducer from '../slices/contracts'
import notificationsReducer from '../slices/notifications'

export const store = configureStore({
  reducer: {
    positions: positionsReducer,
    pools: poolsReducer,
    liquidityPositions: liquidityPositionsReducer,
    proposals: proposalsReducer,
    chainID: chainIDReducer,
    transactions: transactionsReducer,
    wallet: walletReducer,
    systemDebt: systemDebtReducer,
    positionsEditor: positionsEditorReducer,
    referenceTokens: referenceTokensReducer,

    governor: governorReducer,
    liquidations: liquidationsReducer,
    market: marketReducer,
    prices: pricesReducer,
    rates: ratesReducer,

    ethBalance: ethBalanceReducer,
    hueBalance: hueBalanceReducer,
    lendHueBalance: lendHueBalanceReducer,
    referenceTokenBalances: referenceTokenBalancesReducer,

    contracts: contractsReducer,
    notifications: notificationsReducer,
  },
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>
