import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { sliceState, nullState } from '../'
import { fetchPositions, fetchPositionsArgs } from './api'
import { getGenericReducerBuilder } from '../'

export interface Position {
  collateralCount: number,
  debtCount: number,
  approximateRewards: number,
  rewards: number,
  id: number,
  lastBorrowTime: number,
  updating: boolean,
  updated: boolean,
  claimingRewards: boolean,
  claimedRewards: boolean,
}

export interface PositionMap { [key: number]: Position }

export interface PositionsState extends sliceState {
  data: null | PositionMap
}

export const getPositions = createAsyncThunk(
  'positions/getPositions',
  async (data: fetchPositionsArgs) => await fetchPositions(data),
);

const initialState: PositionsState = nullState

export const positionsSlice = createSlice({
  name: 'positions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder = getGenericReducerBuilder(builder, getPositions)
  },
});

export default positionsSlice.reducer
