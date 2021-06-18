import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import counterReducer from '../slices/counter/counterSlice'
import positionsReducer from '../slices/positions'
import chainIDReducer from '../slices/chainID'
import walletReducer from '../slices/wallet'
import marketReducer from '../slices/market'
import systemDebtReducer from '../slices/systemDebt'


export const store = configureStore({
  reducer: {
    counter: counterReducer,
    positions: positionsReducer,
    chainID: chainIDReducer,
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
