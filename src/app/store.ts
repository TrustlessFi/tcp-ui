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
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>
