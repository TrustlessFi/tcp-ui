import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { sliceState, getStateWithValue, getGenericReducerBuilder } from '../'
import getContract, { getMulticallContract } from '../../utils/getContract'
import { PromiseType } from '@trustlessfi/utils'

import { Rewards, Accounting } from '@trustlessfi/typechain'
import { ProtocolContract, ContractsInfo } from '../contracts'
import { getLocalStorage } from '../../utils'
import { executeMulticalls, getMulticall, rc, getDuplicateFuncMulticall } from '@trustlessfi/multicall'

export interface rewardsInfo {
  twapDuration: number
  liquidationPenalty: number
  weth: string
  lastPeriodGlobalRewardsAccrued: number
  countPools: number
  firstPeriod: number
  periodLength: number
  rewardStatuses: {[key in number]: {
    poolAddress: string
    totalRewards: string
    cumulativeLiquidity: string
    poolLiquidity: string
  }}
}

export interface rewardsArgs {
  contracts: ContractsInfo
  trustlessMulticall: string
}

export interface RewardsState extends sliceState<rewardsInfo> {}

export const getRewardsInfo = createAsyncThunk(
  'rewards/getRewardsInfo',
  async (args: rewardsArgs): Promise<rewardsInfo> => {
    const rewards = getContract(args.contracts[ProtocolContract.Rewards], ProtocolContract.Rewards) as Rewards
    const accounting = getContract(args.contracts[ProtocolContract.Accounting], ProtocolContract.Accounting) as Accounting
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
            lastPeriodGlobalRewardsAccrued: rc.BigNumberToNumber,
            countPools: rc.Number,
            firstPeriod: rc.BigNumberToNumber,
            periodLength: rc.BigNumberToNumber,
          }
        ),
      }
    )

    const poolIDs: number[] = []

    for(let i = 1; i <= rewardsInfo.countPools; i++) poolIDs.push(i)

    const { poolConfigs } = await executeMulticalls(
      trustlessMulticall,
      {
        poolConfigs: getDuplicateFuncMulticall(
          rewards,
          'poolConfigForPoolID',
          rc.String,
          Object.fromEntries(poolIDs.map(id => [id, [id]]))
        ),
      },
    )

    const poolIDToAddress = poolConfigs

    const { accountingRewardsStatuses } = await executeMulticalls(
      trustlessMulticall,
      {
        accountingRewardsStatuses: getDuplicateFuncMulticall(
          accounting,
          'getRewardStatus',
          (result: any) => result as PromiseType<ReturnType<Accounting['getRewardStatus']>>,
          Object.fromEntries(poolIDs.map(id => [id, [poolIDToAddress[id]]]))
        ),
      }
    )

    const { accountingPoolLiquidity } = await executeMulticalls(
      trustlessMulticall,
      {
        accountingPoolLiquidity: getDuplicateFuncMulticall(
          accounting,
          'poolLiquidity',
          rc.BigNumberToString,
          Object.fromEntries(poolIDs.map(id => [id, [poolIDToAddress[id]]]))
        ),
      }
    )

    return {
      ...rewardsInfo,
      rewardStatuses: Object.fromEntries(
        poolIDs.map(id => [id, {
          poolAddress: poolIDToAddress[id],
          totalRewards: accountingRewardsStatuses[id].totalRewards.toString(),
          cumulativeLiquidity: accountingRewardsStatuses[id].cumulativeLiquidity.toString(),
          poolLiquidity: accountingPoolLiquidity[id]
        }])
      )
    }
  }
)

// TODO add to local storage
const name = 'rewards'

export const rewardsSlice = createSlice({
  name,
  initialState: getStateWithValue<rewardsInfo>(getLocalStorage(name, null)) as RewardsState,
  reducers: {
    clearRewardsInfo: (state) => {
      state.data.value = null
    },
  },
  extraReducers: (builder) => {
    builder = getGenericReducerBuilder(builder, getRewardsInfo)
  },
})

export const { clearRewardsInfo } = rewardsSlice.actions

export default rewardsSlice.reducer
