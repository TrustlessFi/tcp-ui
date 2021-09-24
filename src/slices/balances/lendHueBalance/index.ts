import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { initialState, getGenericReducerBuilder } from '../../'
import { balanceState, tokenBalanceThunk } from '../'
import { ProtocolContract } from '../../contracts/index'

export type lendHueBalanceArgs = {
  LendHue: string
  Market: string
  TcpMulticall: string
  userAddress: string

}

export const getLendHueBalance = createAsyncThunk(
  'lendHueBalance/getLendHueBalance',
  async (args: lendHueBalanceArgs) => tokenBalanceThunk(
    { tokenAddress: args.LendHue, userAddress: args.userAddress, TcpMulticall: args.TcpMulticall},
    [{contract: ProtocolContract.Market, address: args.Market}],
    [],
  ),
)

export const lendHueBalanceSlice = createSlice({
  name: 'lendHueBalance',
  initialState: initialState as balanceState,
  reducers: {
    clearLendHueBalance: (state) => {
      state.data.value = null
    },
  },
  extraReducers: (builder) => {
    builder = getGenericReducerBuilder(builder, getLendHueBalance)
  },
})

export const { clearLendHueBalance } = lendHueBalanceSlice.actions

export default lendHueBalanceSlice.reducer
