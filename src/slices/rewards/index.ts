import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { sliceState, getStateWithValue, getGenericReducerBuilder } from '../'
import getContract, { getMulticallContract } from '../../utils/getContract'
import { range } from '../../utils'
import { PromiseType } from '@trustlessfi/utils'

import { Rewards, Accounting } from '@trustlessfi/typechain'
import { ProtocolContract, ContractsInfo } from '../contracts'
import { getLocalStorage } from '../../utils'
import { executeMulticalls, oneContractOneFunctionMC, rc, oneContractManyFunctionMC } from '@trustlessfi/multicall'

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
        rewardsInfo: oneContractManyFunctionMC(
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

    const poolIDs = range(1, rewardsInfo.countPools)

    const { poolConfigs } = await executeMulticalls(
      trustlessMulticall,
      {
        poolConfigs: oneContractOneFunctionMC(
          rewards,
          'getPoolConfigForPoolID',
          (result: any) => result as PromiseType<ReturnType<Rewards['getPoolConfigForPoolID']>>,
          Object.fromEntries(poolIDs.map(id => [id, [id]]))
        ),
      },
    )

    const poolIDToAddress = Object.fromEntries(poolIDs.map(id => [id, [poolConfigs[id].pool]]))

    const { accountingRewardsStatuses, accountingPoolLiquidity } = await executeMulticalls(
      trustlessMulticall,
      {
        accountingRewardsStatuses: oneContractOneFunctionMC(
          accounting,
          'getRewardStatus',
          (result: any) => result as PromiseType<ReturnType<Accounting['getRewardStatus']>>,
          poolIDToAddress,
        ),
        accountingPoolLiquidity: oneContractOneFunctionMC(
          accounting,
          'poolLiquidity',
          rc.BigNumberToString,
          poolIDToAddress,
        ),
      }
    )

    return {
      ...rewardsInfo,
      rewardStatuses: Object.fromEntries(
        poolIDs.map(id => [id, {
          poolAddress: poolConfigs[id].pool,
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
