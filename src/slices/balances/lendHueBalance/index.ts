import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ProtocolContract } from '../../../utils/protocolContracts'
import { initialState, getGenericReducerBuilder } from '../../'
import { balanceState, getTokenBalanceThunk } from '../'

export const getLendHueBalance = createAsyncThunk(
  'lendHueBalance/getBalances',
  getTokenBalanceThunk({contract: ProtocolContract.LendHue}, [ProtocolContract.Market], []),
)

export const lendHueBalanceSlice = createSlice({
  name: 'lendHueBalance',
  initialState: initialState as balanceState,
  reducers: {},
  extraReducers: (builder) => {
    builder = getGenericReducerBuilder(builder, getLendHueBalance)
  },
});

export default lendHueBalanceSlice.reducer;
