import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { sliceState, initialState } from '../'
import { fetchPools } from './api'

export interface getPoolsArgs {
  TrustlessMulticall: string
  ProtocolDataAggregator: string
}

export interface poolTokenInfo {
  address: string
  name: string
  symbol: string
  decimals: number
}

export interface poolInfo {
  token0: poolTokenInfo
  token1: poolTokenInfo
  sqrtRatioX96: string
  liquidity: string
  tickCurrent: number
}

export interface poolsInfo {[key: string]: poolInfo}

export interface PoolsState extends sliceState<poolsInfo> {}

export const getPools = createAsyncThunk(
  'pools/getPools',
  async (args: getPoolsArgs) => await fetchPools(args),
)

export const poolsSlice = createSlice({
  name: 'pools',
  initialState: initialState as PoolsState,
  reducers: {},
  extraReducers: (builder) => {
    // TODO add back in the generic builder
    builder
      .addCase(getPools.pending, (state) => {
        state.loading = true
      })
      .addCase(getPools.rejected, (state, action) => {
        state.loading = false
        state.data.error = action.error
      })
      .addCase(getPools.fulfilled, (state, action) => {
        state.loading = false
        state.data.value = action.payload
      })
  },
})

export default poolsSlice.reducer
