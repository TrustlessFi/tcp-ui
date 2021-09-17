import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { sliceState, initialState } from '../'
import { fetchPositions, executeCreatePosition } from './api'
import { systemDebtInfo } from '../systemDebt'
import { ChainID } from '../chainID'
import { marketInfo } from "../market"
import {
  getGenericReducerBuilder,
  getGenericReducerPending,
  getGenericReducerRejected,
  getGenericReducerFulfilled,
} from '../';

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

export interface positionsInfo { [key: number]: Position }

export interface positionsArgs {
  chainID: ChainID,
  userAddress: string,
  sdi: systemDebtInfo,
  marketInfo: marketInfo,
}

export interface createPositionArgs {
  chainID: ChainID,
  collateralCount: number,
  debtCount: number,
}

export interface PositionsState extends sliceState<positionsInfo> {}

export const getPositions = createAsyncThunk(
  'positions/getPositions',
  async (data: positionsArgs) => await fetchPositions(data),
)

export const createPosition = createAsyncThunk(
  'positions/createPosition',
  async (data: createPositionArgs, {dispatch}) => await executeCreatePosition(dispatch, data),
)

export const positionsSlice = createSlice({
  name: 'positions',
  initialState: initialState as PositionsState,
  reducers: {},
  extraReducers: (builder) => {
    builder = getGenericReducerBuilder(builder, getPositions)

    builder = getGenericReducerPending(builder, createPosition)
    builder = getGenericReducerRejected(builder, createPosition)
    builder
      .addCase(createPosition.fulfilled, (state, action) => {
        state.loading = false
        state.data.value = null
      })
  },
})

export default positionsSlice.reducer
