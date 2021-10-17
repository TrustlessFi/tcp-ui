import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { Fee } from '../../utils/'
import { sliceState, initialState, getGenericReducerBuilder } from '../'
import { fetchPoolMetadata } from './api'


export interface getPoolMetadataArgs {
  Rewards: string
  TrustlessMulticall: string
  ProtocolDataAggregator: string
}

export interface poolMetadata {
  fee: Fee
  rewardsPortion: number
  poolID: number
  address: string
  sqrtPriceX96: string
  token0: { address: string, symbol: string }
  token1: { address: string, symbol: string }
}

export interface poolsMetadata {[key: string]: poolMetadata}

export interface PoolsState extends sliceState<poolsMetadata> {}

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
