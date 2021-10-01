import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Pool as UniswapPool, FeeAmount } from '@uniswap/v3-sdk'
import { Token as UniswapToken, BigintIsh } from '@uniswap/sdk-core';

import { sliceState, initialState } from '../'
import { ChainID } from '../chainID'
import { fetchPools } from './api'

export interface SerializedUniswapToken {
  chainID: ChainID
  address: string,
  name: string,
  symbol: string,
  decimals: number,
}

export interface SerializedUniswapPool {
  tokenA: SerializedUniswapToken
  tokenB: SerializedUniswapToken
  fee: FeeAmount
  sqrtRatioX96: BigintIsh
  liquidity: BigintIsh
  tickCurrent: number
}

export interface getPoolsArgs {
    chainID: ChainID,
    ProtocolDataAggregator: string
}

export interface poolArgs {
    chainID: ChainID,
    poolID: number,
    Rewards: string
}

export type poolsInfo = {[key: string]: SerializedUniswapPool}

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
