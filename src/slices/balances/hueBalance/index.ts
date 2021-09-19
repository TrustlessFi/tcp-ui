import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { initialState, getGenericReducerBuilder } from '../../'
import { balanceState, tokenBalanceThunk } from '../'
import { ProtocolContract } from '../../contracts';

export type hueBalanceArgs = {
  Hue: string
  Market: string
  userAddress: string
}

export const getHueBalance = createAsyncThunk(
  'hueBalance/getBalances',
  async (args: hueBalanceArgs) => tokenBalanceThunk(
    { tokenAddress: args.Hue, userAddress: args.userAddress},
    [{contract: ProtocolContract.Market, address: args.Market}],
    [{contract: ProtocolContract.Hue, address: args.Hue}],
  ),
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
