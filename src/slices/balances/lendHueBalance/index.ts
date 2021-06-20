import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ProtocolContract } from '../../../utils/protocolContracts'
import { initialState, getGenericReducerBuilder } from '../../'
import { balanceState, getTokenBalanceThunk } from '../'

export const getLendHueBalances = createAsyncThunk(
  'lendHueBalance/getBalances',
  getTokenBalanceThunk(ProtocolContract.LendZhu, [ProtocolContract.Market, ProtocolContract.Lend]),
)

export const lendHueBalanceSlice = createSlice({
  name: 'lendHueBalance',
  initialState: initialState as balanceState,
  reducers: {},
  extraReducers: (builder) => {
    builder = getGenericReducerBuilder(builder, getLendHueBalances)
  },
});

export default lendHueBalanceSlice.reducer;
