import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { sliceState, getState, getGenericReducerBuilder } from '../'
import { rewardsInfo } from '../rewards'
import { poolsMetadata } from '../poolMetadata'
import getContract, { getMulticallContract } from '../../utils/getContract'

import { Prices } from "../../utils/typechain"
import { ProtocolContract } from '../contracts'
import { getLocalStorage } from '../../utils'
import { rc, executeMulticalls, getDuplicateFuncMulticall } from '@trustlessfi/multicall'

export type poolTickInfo = {[poolAddress: string]: number}

export interface poolTickState extends sliceState<poolTickInfo> {}

export interface poolTickArgs {
  rewardsInfo: rewardsInfo
  poolMetadata: poolsMetadata
  Prices: string
  TrustlessMulticall: string
}

// TODO add to local cache
export const getPoolTicks = createAsyncThunk(
  'poolTicks/getPoolTicks',
  async (args: poolTickArgs): Promise<poolTickInfo> => {
    const prices = getContract(args.Prices, ProtocolContract.Prices) as Prices
    const trustlessMulticall = getMulticallContract(args.TrustlessMulticall)

    const { ticks } = await executeMulticalls(
      trustlessMulticall,
      {
        ticks: getDuplicateFuncMulticall(
          prices,
          'calculateInstantTwappedTick',
          rc.Number,
          Object.fromEntries(Object.keys(args.poolMetadata).map(poolAddress => [poolAddress, [poolAddress, args.rewardsInfo.twapDuration]]))
        )
      }
    )

    return ticks
  }
)

const name = 'poolTicks'

export const poolTicksSlice = createSlice({
  name,
  initialState: getState<poolTickInfo>(getLocalStorage(name, null)) as poolTickState,
  reducers: {},
  extraReducers: (builder) => {
    builder = getGenericReducerBuilder(builder, getPoolTicks)
  },
});

export default poolTicksSlice.reducer
