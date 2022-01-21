import { RootState } from '../../app/store'
import { getThunkDependencies } from '../fetchNodes'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getLocalStorageSliceState, getGenericReducerBuilder, NonNullValues } from '../'
import getContract, { getMulticallContract } from '../../utils/getContract'

import { Rewards } from '@trustlessfi/typechain'
import ProtocolContract from '../contracts/ProtocolContract'
import { executeMulticalls, rc, oneContractManyFunctionMC } from '@trustlessfi/multicall'

export interface rewardsInfo {
  twapDuration: number
  liquidationPenalty: number
  weth: string
  countPools: number
  firstPeriod: number
  periodLength: number
}

const dependencies = getThunkDependencies(['contracts', 'trustlessMulticall'])

export const getRewardsInfo = {
  stateSelector: (state: RootState) => state.rewards,
  dependencies,
  thunk:
    createAsyncThunk(
      'rewards/getRewardsInfo',
      async (args: NonNullValues<typeof dependencies>): Promise<rewardsInfo> => {
        const rewards = getContract(args.contracts[ProtocolContract.Rewards], ProtocolContract.Rewards) as Rewards
        const trustlessMulticall = getMulticallContract(args.trustlessMulticall)

        const { rewardsInfo } = await executeMulticalls(
          trustlessMulticall,
          {
            rewardsInfo: oneContractManyFunctionMC(
              rewards,
              {
                twapDuration: rc.Number,
                liquidationPenalty: rc.BigNumberUnscale,
                weth: rc.String,
                countPools: rc.Number,
                firstPeriod: rc.BigNumberToNumber,
                periodLength: rc.BigNumberToNumber,
              }
            ),
          }
        )

        return rewardsInfo
      }
    )
}

// TODO add to local storage
const name = 'rewards'

export const rewardsSlice = createSlice({
  name,
  initialState: getLocalStorageSliceState<rewardsInfo>(name),
  reducers: {
    clearRewardsInfo: (state) => {
      state.value = null
    },
  },
  extraReducers: (builder) => {
    builder = getGenericReducerBuilder(builder, getRewardsInfo.thunk)
  },
})

export const { clearRewardsInfo } = rewardsSlice.actions

export default rewardsSlice.reducer
