import { BigNumber } from "ethers"
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { sliceState, initialState } from '../'
import { addLiquidityToPosition, fetchLiquidityPositions } from './api'
import { getGenericReducerBuilder } from '../'
import { ChainID } from '../chainID'
import { LiquidityPool } from '../pools'

export interface LiquidityPosition {
  addingLiquidity?: boolean,
  cumulativeLiquidity: number,
  id: number,
  lastBlockPositionIncreased: number,
  lastTimeRewarded: number,
  liquidity: BigNumber,
  nonce: BigNumber,
  owner: string,
  pool: LiquidityPool,
  removingLiquidity?: boolean,
  tickLower: number,
  tickUpper: number,
  tokensOwed0: BigNumber,
  tokensOwed1: BigNumber,
  totalRewards: number,
};


export interface liquidityPositions {
  creating: boolean,
  loading: boolean,
  positions: {
    [key: number]: LiquidityPosition,
  }
}

export interface liquidityPositionsArgs {
  chainID: ChainID,
  userAddress: string
}

export interface liquidityPositionArgs {
  chainID: ChainID,
  positionID: number
}

export interface LiquidityPositionsState extends sliceState<liquidityPositions> {}

export const getLiquidityPositions = createAsyncThunk(
  'liquidityPositions/getLiquidityPositions',
  async (data: liquidityPositionsArgs) => fetchLiquidityPositions(data),
)

const addLiquidityToPositionThunk = createAsyncThunk(
  'liquidityPositions/addLiquidityToPosition',
  async (params: { positionID: string, liquidityToAdd: number }) => addLiquidityToPosition(params.positionID, params.liquidityToAdd)
)

export { addLiquidityToPositionThunk as addLiquidityToPosition }

export const liquidityPositionsSlice = createSlice({
  name: 'liquidityPositions',
  initialState: initialState as LiquidityPositionsState,
  reducers: {
    loading: (state) => {
      state.loading = true
    }
  },
  extraReducers: (builder) => {
    getGenericReducerBuilder(builder, getLiquidityPositions)
    getGenericReducerBuilder(builder, addLiquidityToPositionThunk)
  },
})

export const { loading } = liquidityPositionsSlice.actions;

export default liquidityPositionsSlice.reducer