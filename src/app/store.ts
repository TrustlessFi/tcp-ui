import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import counterReducer from '../slices/counter/counterSlice'
import positionsReducer from '../slices/positions'
import providerReducer from '../slices/provider'
import walletReducer from '../slices/wallet'
import marketReducer from '../slices/market'
import systemDebtReducer from '../slices/systemDebt'


export const store = configureStore({
  reducer: {
    counter: counterReducer,
    positions: positionsReducer,
    provider: providerReducer,
    wallet: walletReducer,
    market: marketReducer,
    systemDebt: systemDebtReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
