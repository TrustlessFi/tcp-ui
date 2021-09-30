import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { BigNumber } from "ethers"

import { getGenericReducerBuilder } from '../'
import { sliceState, initialState } from '../'
import { ChainID } from '../chainID'
import { fetchPools } from './api'

export interface SlotInfo {
  sqrtPriceX96: BigNumber,
  tick: number,
  observationIndex: number,
  observationCardinality: number,
  observationCardinalityNext: number,
  feeProtocol: number,
  unlocked: boolean,
}

export interface LiquidityPool {
    address: string,
    fee: number,
    liquidity: number,
    slot0: SlotInfo,
    token0Address: string,
    token0Decimals: number,
    token0Symbol: string,
    token1Address: string,
    token1Decimals: number,
    token1Symbol: string
}

export interface poolsArgs {
    chainID: ChainID,
    ProtocolDataAggregator: string
}

export interface poolArgs {
    chainID: ChainID,
    poolID: number,
    Rewards: string
}

export type poolsInfo = LiquidityPool[]

export interface PoolsState extends sliceState<poolsInfo> {}

export const getPools = createAsyncThunk(
  'pools/getPools',
  async (data: poolsArgs) => await fetchPools(data),
)

export const poolsSlice = createSlice({
  name: 'pools',
  initialState: initialState as PoolsState,
  reducers: {},
  extraReducers: (builder) => {
    builder = getGenericReducerBuilder(builder, getPools)
  },
})

export default poolsSlice.reducer