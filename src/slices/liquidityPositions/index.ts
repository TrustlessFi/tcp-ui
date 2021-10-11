import { BigNumber } from "ethers"
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { sliceState, initialState } from '../'
import { addLiquidityToPosition, fetchLiquidityPositions } from './api'
import { getGenericReducerBuilder } from '../'
import { ChainID } from '@trustlessfi/addresses'

export interface LiquidityPosition {
  // set during update?
  addingLiquidity?: boolean,
  removingLiquidity?: boolean,
  nonce: BigNumber,

  // ???
  tokensOwed0: BigNumber,
  tokensOwed1: BigNumber,

  // Core data
  cumulativeLiquidity: string,
  id: number,
  lastTimeRewarded: number,
  lastBlockPositionIncreased: number,
  liquidity: BigNumber,
  owner: string,
  pool: string,
  tickLower: number,
  tickUpper: number,
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
  Accounting: string,
  chainID: ChainID,
  Rewards: string,
  userAddress: string
}

export interface liquidityPositionArgs {
  Accounting: string,
  chainID: ChainID,
  Rewards: string
  positionID: number,
}

export interface LiquidityPositionsState extends sliceState<liquidityPositions> {}

export const getLiquidityPositions = createAsyncThunk(
  'liquidityPositions/getLiquidityPositions',
  async (data: liquidityPositionsArgs) => fetchLiquidityPositions(data),
)

export const addLiquidityToPositionThunk = createAsyncThunk(
  'liquidityPositions/addLiquidityToPosition',
  async (params: { positionID: string, liquidityToAdd: number }) => addLiquidityToPosition(params.positionID, params.liquidityToAdd)
)

export { addLiquidityToPositionThunk as addLiquidityToPosition }

export const liquidityPositionsSlice = createSlice({
  name: 'liquidityPositions',
  initialState: initialState as LiquidityPositionsState,
  reducers: {},
  extraReducers: (builder) => {
    getGenericReducerBuilder(builder, getLiquidityPositions)
    getGenericReducerBuilder(builder, addLiquidityToPositionThunk)
  },
})

export default liquidityPositionsSlice.reducer
