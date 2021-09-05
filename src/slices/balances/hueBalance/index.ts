import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ProtocolContract } from '../../../utils/protocolContracts'
import { initialState, getGenericReducerBuilder } from '../../'
import { balanceState, getTokenBalanceThunk } from '../'

export const getHueBalance = createAsyncThunk(
  'hueBalance/getBalances',
  getTokenBalanceThunk({contract: ProtocolContract.Hue}, [ProtocolContract.Market], []),
)

export const hueBalanceSlice = createSlice({
  name: 'hueBalance',
  initialState: initialState as balanceState,
  reducers: {},
  extraReducers: (builder) => {
    builder = getGenericReducerBuilder(builder, getHueBalance)
  },
});

export default hueBalanceSlice.reducer;
