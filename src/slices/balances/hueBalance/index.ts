import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ProtocolContract } from '../../../utils/protocolContracts'
import { initialState, getGenericReducerBuilder } from '../../'
import { balanceState, getTokenBalanceThunk } from '../'

export const getHueBalances = createAsyncThunk(
  'hueBalance/getBalances',
  getTokenBalanceThunk(ProtocolContract.Zhu, [ProtocolContract.Market, ProtocolContract.Lend]),
)

export const hueBalanceSlice = createSlice({
  name: 'hueBalance',
  initialState: initialState as balanceState,
  reducers: {},
  extraReducers: (builder) => {
    builder = getGenericReducerBuilder(builder, getHueBalances)
  },
});

export default hueBalanceSlice.reducer;
