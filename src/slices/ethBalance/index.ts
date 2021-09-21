import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { sliceState, initialState } from '../'
import { getGenericReducerBuilder } from '../'
import { unscale, bnf } from '../../utils'
import getProvider from '../../utils/getProvider'

export interface EthBalanceState extends sliceState<number> {}

export const getEthBalance = createAsyncThunk(
  'ethBalance/getEthBalance',
  async (userAddress: string) => {
    return unscale(bnf(await getProvider().send("eth_getBalance", [userAddress])))
  }
)

export const ethBalanceSlice = createSlice({
  name: 'ethBalance',
  initialState: initialState as EthBalanceState,
  reducers: {},
  extraReducers: (builder) => {
    builder = getGenericReducerBuilder(builder, getEthBalance)
  },
});

export default ethBalanceSlice.reducer
