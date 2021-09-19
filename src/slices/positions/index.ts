import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { sliceState, initialState } from '../'
import { fetchPositions } from './api'
import { systemDebtInfo } from '../systemDebt'
import { ChainID } from '../chainID'
import { marketInfo } from "../market"
import {
  getGenericReducerBuilder,
} from '../';
import { getGenericWriteReducerBuilder } from '../index';
import { executeCreatePosition } from './api'

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
  Accounting: string,
  HuePositionNFT: string,
}

export interface createPositionArgs {
  collateralCount: number,
  debtCount: number,
  Market: string,
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
    builder = getGenericWriteReducerBuilder(builder, createPosition)
  },
})

export default positionsSlice.reducer
