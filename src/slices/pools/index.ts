import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { BigNumber } from "ethers"
import { Token as UniswapToken, BigintIsh } from '@uniswap/sdk-core';
import { FeeAmount, Pool as UniswapPool } from '@uniswap/v3-sdk'

import { getGenericReducerBuilder } from '../'
import { sliceState, initialState } from '../'
import { ChainID } from '../chainID'
import { fetchPools } from './api'

enum TCPUniswapPoolType {
  Collateral,
  Protocol,
}

class TCPUniswapPool extends UniswapPool {
  address: string
  type: TCPUniswapPool

  constructor (usArgs: {
      tokenA: UniswapToken,
      tokenB: UniswapToken,
      fee: FeeAmount,
      sqrtRatioX96: BigintIsh,
      liquidity: BigintIsh,
      tickCurrent: number,
    },
    address: string,
    type: TCPUniswapPool,
  ) {
    super(usArgs.tokenA, usArgs.tokenB, usArgs.fee, usArgs.sqrtRatioX96, usArgs.liquidity, usArgs.tickCurrent)

    this.address = address
    this.type = type
  }
}

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
