import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { Fee } from '../../utils/'
import { sliceState, initialState, getGenericReducerBuilder } from '../'
import { tokenInfo, approval } from '../balances'
import { fetchPoolMetadata } from './api'


export interface getPoolMetadataArgs {
  Rewards: string
  TrustlessMulticall: string
  ProtocolDataAggregator: string
  userAddress: string
}

interface tokenData {
  info: tokenInfo
  rewardsApproval: approval
  userBalance: number
}

export interface poolMetadata {
  fee: Fee
  rewardsPortion: number
  poolID: number
  address: string
  sqrtPriceX96: string
  token0: tokenData
  token1: tokenData
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
