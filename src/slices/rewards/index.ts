import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { sliceState, getStateWithValue, getGenericReducerBuilder } from '../'
import getContract, { getMulticallContract } from '../../utils/getContract'

import { Rewards, } from '@trustlessfi/typechain'
import { ProtocolContract, ContractsInfo } from '../contracts'
import { getLocalStorage } from '../../utils'
import { executeMulticalls, getMulticall, rc } from '@trustlessfi/multicall'

export type rewardsInfo = {
  twapDuration: number,
  liquidationPenalty: number,
  weth: string,
}

export type rewardsArgs = {
  contracts: ContractsInfo,
  trustlessMulticall: string,
}

export interface RewardsState extends sliceState<rewardsInfo> {}

export const getRewardsInfo = createAsyncThunk(
  'rewards/getRewardsInfo',
  async (args: rewardsArgs): Promise<rewardsInfo> => {
    const rewards = getContract(args.contracts[ProtocolContract.Rewards], ProtocolContract.Rewards) as Rewards
    const trustlessMulticall = getMulticallContract(args.trustlessMulticall)

    const { rewardsInfo } = await executeMulticalls(
      trustlessMulticall,
      {
        rewardsInfo: getMulticall(
          rewards,
          {
            twapDuration: rc.Number,
            liquidationPenalty: rc.BigNumberUnscale,
            weth: rc.String,
          }
        ),
      }
    )

    return rewardsInfo
  }
)

// TODO add to local storage
const name = 'rewards'

export const rewardsSlice = createSlice({
  name,
  initialState: getStateWithValue<rewardsInfo>(getLocalStorage(name, null)) as RewardsState,
  reducers: {},
  extraReducers: (builder) => {
    builder = getGenericReducerBuilder(builder, getRewardsInfo)
  },
});

export default rewardsSlice.reducer
