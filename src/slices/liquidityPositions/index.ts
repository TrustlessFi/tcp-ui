import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { sliceState, initialState } from '../'
import { fetchLiquidityPositions } from './api'
import { getGenericReducerBuilder } from '../'

export interface LiquidityPosition {
  positionID: string
  poolID: number
  cumulativeLiquidity: string
  lastTimeRewarded: number
  lastBlockPositionIncreased: number
  liquidity: string
  owner: string
  tickLower: number
  tickUpper: number
  totalRewards: string
}

export interface liquidityPositions { [id: string]: LiquidityPosition }

export interface liquidityPositionsArgs {
  Accounting: string,
  TrustlessMulticall: string,
  userAddress: string
}

export interface LiquidityPositionsState extends sliceState<liquidityPositions> {}

export const getLiquidityPositions = createAsyncThunk(
  'liquidityPositions/getLiquidityPositions',
  async (data: liquidityPositionsArgs) => fetchLiquidityPositions(data),
)

export const liquidityPositionsSlice = createSlice({
  name: 'liquidityPositions',
  initialState: initialState as LiquidityPositionsState,
  reducers: {
    clearLiquidityPositions: (state) => {
      state.data.value = null
    },
  },
  extraReducers: (builder) => {
    getGenericReducerBuilder(builder, getLiquidityPositions)
  },
})

export const { clearLiquidityPositions } = liquidityPositionsSlice.actions

export default liquidityPositionsSlice.reducer
