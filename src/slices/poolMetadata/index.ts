import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { sliceState, initialState, getGenericReducerBuilder } from '../'
import { fetchPoolMetadata } from './api'


export interface getPoolMetadataArgs {
  TrustlessMulticall: string
  ProtocolDataAggregator: string
}

export interface poolMetadata {
  token0: { address: string, symbol: string }
  token1: { address: string, symbol: string }
}

export interface poolsInfo {[key: string]: poolMetadata}

export interface PoolsState extends sliceState<poolsInfo> {}

export const getPoolMetadata = createAsyncThunk(
  'pools/getPoolMetadata',
  async (args: getPoolMetadataArgs) => await fetchPoolMetadata(args),
)

export const poolsSlice = createSlice({
  name: 'pools',
  initialState: initialState as PoolsState,
  reducers: {},
  extraReducers: (builder) => {
    builder = getGenericReducerBuilder(builder, getPoolMetadata)
  },
})

export default poolsSlice.reducer
