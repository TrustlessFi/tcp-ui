import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { initialState, getGenericReducerBuilder } from '../../'
import { balanceState, tokenBalanceThunk } from '../'
import { ProtocolContract } from '../../contracts/index'


export type lendHueBalanceArgs = {
  LendHue: string
  Market: string
  userAddress: string
}

export const getLendHueBalance = createAsyncThunk(
  'lendHueBalance/getBalances',
  async (args: lendHueBalanceArgs) => tokenBalanceThunk(
    { tokenAddress: args.LendHue, userAddress: args.userAddress},
    {[ProtocolContract.Market]: args.Market},
    {}
  ),
)

export const lendHueBalanceSlice = createSlice({
  name: 'lendHueBalance',
  initialState: initialState as balanceState,
  reducers: {},
  extraReducers: (builder) => {
    builder = getGenericReducerBuilder(builder, getLendHueBalance)
  },
})

export default lendHueBalanceSlice.reducer
