import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import counterReducer from '../slices/counter/counterSlice'
import positionsReducer from '../slices/positions'
import providerReducer from '../slices/provider'
import walletReducer from '../slices/wallet'
import chainIDReducer from '../slices/chainID'
import marketReducer from '../slices/market'


export const store = configureStore({
  reducer: {
    counter: counterReducer,
    positions: positionsReducer,
    provider: providerReducer,
    wallet: walletReducer,
    chainID: chainIDReducer,
    market: marketReducer,
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
