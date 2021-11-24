import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { sliceState } from '../'
import { rewardsInfo } from '../rewards'
import { poolsMetadata } from '../poolsMetadata'
import { approval } from '../balances'
import { ContractsInfo } from '../contracts'

import { getInitialStateCopy } from '../'
import { fetchPoolCurrentData } from './api'

export interface tokenData {
  address: string
  rewardsApproval: approval
  userBalance: number
}

export type poolCurrentInfo = {
  instantTick: number,
  twapTick: number,
  token0: tokenData
  token1: tokenData
}

export type poolCurrentDataState = {[key in string]: sliceState<poolCurrentInfo>}

export interface poolCurrentDataArgs {
  contracts: ContractsInfo
  trustlessMulticall: string
  userAddress: string,
  rewardsInfo: rewardsInfo
  poolsMetadata: poolsMetadata
  poolAddress: string
}

export const getPoolCurrentData = createAsyncThunk(
  'poolCurrentData/getCurrentData',
  async (args: poolCurrentDataArgs) => await fetchPoolCurrentData(args),
)

export const poolCurrentDataSlice = createSlice({
  name: 'poolCurrentData' ,
  initialState: {} as poolCurrentDataState,
  reducers: {
    clearPoolCurrentData: (state, action: PayloadAction<string>) => {
      const poolToRemove = action.payload
      return Object.fromEntries(Object.keys(state).filter(pool => pool !== poolToRemove).map(pool => [pool, state[pool]]))
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPoolCurrentData.pending, (state, action) => {
        const poolAddress = action.meta.arg.poolAddress
        const initialState = getInitialStateCopy<poolCurrentInfo>()
        initialState.loading = true
        return {...state, [poolAddress]: initialState}
      })
      .addCase(getPoolCurrentData.rejected, (state, action) => {
        const poolAddress = action.meta.arg.poolAddress
        state[poolAddress].data.error = action.error
      })
      .addCase(getPoolCurrentData.fulfilled, (state, action) => {
        const poolAddress = action.meta.arg.poolAddress
        state[poolAddress].loading = false
        state[poolAddress].data.value = action.payload
      })
  },
})

export const { clearPoolCurrentData } = poolCurrentDataSlice.actions

export default poolCurrentDataSlice.reducer
