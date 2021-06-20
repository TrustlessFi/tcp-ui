import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import positionsReducer from '../slices/positions'
import chainIDReducer from '../slices/chainID'
import walletReducer from '../slices/wallet'
import systemDebtReducer from '../slices/systemDebt'
import positionsEditorReducer from '../slices/positionsEditor'

import governorReducer from '../slices/governor'
import liquidationsReducer from '../slices/liquidations'
import marketReducer from '../slices/market'
import pricesReducer from '../slices/prices'
import ratesReducer from '../slices/rates'

import ethBalanceReducer from '../slices/ethBalance'
import hueBalanceReducer from '../slices/balances/hueBalance'
import lendHueBalanceReducer from '../slices/balances/lendHueBalance'

export const store = configureStore({
  reducer: {
    positions: positionsReducer,
    chainID: chainIDReducer,
    wallet: walletReducer,
    systemDebt: systemDebtReducer,
    positionsEditor: positionsEditorReducer,

    governor: governorReducer,
    liquidations: liquidationsReducer,
    market: marketReducer,
    prices: pricesReducer,
    rates: ratesReducer,

    ethBalance: ethBalanceReducer,
    hueBalance: hueBalanceReducer,
    lendHueBalance: lendHueBalanceReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>
