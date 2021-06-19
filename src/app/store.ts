import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import positionsReducer from '../slices/positions'
import chainIDReducer from '../slices/chainID'
import walletReducer from '../slices/wallet'
import marketReducer from '../slices/market'
import governorReducer from '../slices/governor'
import systemDebtReducer from '../slices/systemDebt'
import positionsEditorReducer from '../slices/positionsEditor'

export const store = configureStore({
  reducer: {
    positions: positionsReducer,
    chainID: chainIDReducer,
    wallet: walletReducer,
    market: marketReducer,
    governor: governorReducer,
    systemDebt: systemDebtReducer,
    positionsEditor: positionsEditorReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>
