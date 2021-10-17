import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { sliceState, getState, getGenericReducerBuilder } from '../'
import getContract, { getMulticallContract } from '../../utils/getContract'

import { Rewards, } from '../../utils/typechain'
import { ProtocolContract } from '../contracts'
import { getLocalStorage } from '../../utils'
import { executeMulticalls, getMulticall, rc } from '@trustlessfi/multicall'

export type rewardsInfo = {
  twapDuration: number,
  liquidationPenalty: number,
}

export type rewardsArgs = {
  Rewards: string,
  TrustlessMulticall: string,
}

export interface RewardsState extends sliceState<rewardsInfo> {}

export const getRewardsInfo = createAsyncThunk(
  'rewards/getRewardsInfo',
  async (args: rewardsArgs): Promise<rewardsInfo> => {
    console.log("get rewrds indo")
    const rewards = getContract(args.Rewards, ProtocolContract.Rewards) as Rewards
    const trustlessMulticall = getMulticallContract(args.TrustlessMulticall)

    const { rewardsInfo } = await executeMulticalls(
      trustlessMulticall,
      {
        rewardsInfo: getMulticall(
          rewards,
          {
            twapDuration: rc.Number,
            liquidationPenalty: rc.BigNumberUnscale,
          }
        ),
      }
    )
    console.log({rewardsInfo})

    return rewardsInfo
  }
)

const name = 'rewards'

// TODO add to local storage
export const rewardsSlice = createSlice({
  name,
  initialState: getState<rewardsInfo>(getLocalStorage(name, null)) as RewardsState,
  reducers: {},
  extraReducers: (builder) => {
    builder = getGenericReducerBuilder(builder, getRewardsInfo)
  },
});

export default rewardsSlice.reducer
