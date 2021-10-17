import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { sliceState, getState, getGenericReducerBuilder } from '../'
import { rewardsInfo } from '../rewards'
import { poolsMetadata } from '../poolMetadata'
import getContract, { getMulticallContract } from '../../utils/getContract'
import { approval } from '../balances'

import { Prices } from "../../utils/typechain"
import { ProtocolContract } from '../contracts'
import { getLocalStorage } from '../../utils'
import { rc, executeMulticalls, getDuplicateFuncMulticall } from '@trustlessfi/multicall'
import { initialState, getInitialStateCopy } from '../'
import { fetchPoolCurrentData } from './api'
import { zeroAddress } from '../../utils/index';

interface tokenData {
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
  Rewards: string
  Prices: string
  TrustlessMulticall: string
  userAddress: string,
  rewardsInfo: rewardsInfo
  PoolsMetadata: poolsMetadata
  poolAddress: string
}

export const getPoolCurrentDataThunk = (poolAddress: string) => {
  return createAsyncThunk(
    'poolCurrentData/getCurrentData',
    async (args: poolCurrentDataArgs) => await fetchPoolCurrentData(args, poolAddress),
  )
}

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
    const thunk = getPoolCurrentDataThunk(zeroAddress)
    builder
      .addCase(thunk.pending, (state, action) => {
        const poolAddress = action.meta.arg.poolAddress
        const initialState = getInitialStateCopy<poolCurrentInfo>()
        initialState.loading = true
        return {...state, [poolAddress]: initialState}
      })
      .addCase(thunk.rejected, (state, action) => {
        const poolAddress = action.meta.arg.poolAddress
        state[poolAddress].data.error = action.error
      })
      .addCase(thunk.fulfilled, (state, action) => {
        const poolAddress = action.meta.arg.poolAddress
        state[poolAddress].loading = false
        state[poolAddress].data.value = action.payload
      })
  },
})

export const { clearPoolCurrentData } = poolCurrentDataSlice.actions

export default poolCurrentDataSlice.reducer
