import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { sliceState, nullState } from '../'
import { fetchPositions, fetchPositionsArgs } from './api'
import { getGenericReducerBuilder } from '../'
import { useAppSelector as selector } from '../../app/hooks'
import { AppDispatch } from '../../app/store'
import { getSystemDebtInfo } from '../systemDebt'
import { getMarketInfo } from '../market'

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

export interface PositionMap { [key: string]: Position }

export interface PositionsState extends sliceState {
  data: null | PositionMap
}

export const waitForPositions = (dispatch: AppDispatch): PositionMap | null => {
  // try to just retrieve the positions
  const positions = selector(state => state.positions.data)
  if (positions !== null) return positions

  // if we dont have them, then try to get them
  const provider = selector(state => state.provider)
  const address = selector(state => state.wallet.address)

  if (provider.provider == null || provider.chainID == null) return null

  const sdi = selector(state => state.systemDebt.data)
  const marketInfo = selector(state => state.market.data)

  // fetch any of the missing data
  if (sdi == null) dispatch(getSystemDebtInfo(provider))
  if (marketInfo == null) dispatch(getMarketInfo(provider))

  if (address == null || sdi == null || marketInfo == null) return null

  dispatch(getPositions({
    chainID: provider.chainID,
    provider: provider.provider,
    userAddress: address,
    sdi: sdi,
    marketInfo: marketInfo,
  }))

  return null
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
    /*
      .addCase(getPositions.pending, (state) => {
        state.loading = true
      })
      .addCase(getPositions.rejected, (state, action) => {
        state.loading = false
        state.error = action.error
      })
      .addCase(getPositions.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload;
      });
    */
  },
});

export default positionsSlice.reducer
