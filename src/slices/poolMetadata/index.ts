import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { Fee } from '../../utils/'
import { sliceState, initialState, getGenericReducerBuilder } from '../'
import { tokenInfo } from '../balances'
import { fetchPoolMetadata } from './api'

export interface getPoolsMetadataArgs {
  Rewards: string
  TrustlessMulticall: string
  ProtocolDataAggregator: string
  userAddress: string
}

export interface poolMetadata {
  fee: Fee
  rewardsPortion: number
  poolID: number
  address: string
  token0: tokenInfo
  token1: tokenInfo
}

export interface poolsMetadata {[key: string]: poolMetadata}

export interface PoolsState extends sliceState<poolsMetadata> {}

export const getPoolsMetadata = createAsyncThunk(
  'pools/getPoolMetadata',
  async (args: getPoolsMetadataArgs) => await fetchPoolMetadata(args),
)

export const poolsSlice = createSlice({
  name: 'pools',
  initialState: initialState as PoolsState,
  reducers: {},
  extraReducers: (builder) => {
    builder = getGenericReducerBuilder(builder, getPoolsMetadata)
  },
})

export default poolsSlice.reducer
