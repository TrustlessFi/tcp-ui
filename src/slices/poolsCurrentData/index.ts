import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { initialState, getGenericReducerBuilder } from '../'
import { sliceState } from '../'
import { rewardsInfo } from '../rewards'
import { poolsMetadata } from '../poolsMetadata'
import { contractsInfo } from '../contracts'

import { Contract } from 'ethers'

import { ProtocolContract } from '../contracts'
import getProvider from '../../utils/getProvider'
import getContract, { getMulticallContract } from '../../utils/getContract'
import {
  executeMulticalls,
  manyContractOneFunctionMC,
  oneContractOneFunctionMC,
  oneContractManyFunctionMC,
  rc,
  idToIdAndNoArg,
  idToIdAndArg,
} from '@trustlessfi/multicall'

import { Prices, UniswapV3Pool, Accounting, Rewards } from '@trustlessfi/typechain'

import poolArtifact from '@trustlessfi/artifacts/dist/@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json'
import { sqrtPriceX96ToTick, zeroAddress, PromiseType } from '../../utils'

export type poolCurrentInfo = {
  instantTick: number
  twapTick: number
  poolLiquidity: string
  cumulativeLiquidity: string
  totalRewards: string
  lastPeriodGlobalRewardsAccrued: number
  currentPeriod: number
}

export type poolsCurrentInfo = {
  [key in string]: poolCurrentInfo
}

export type poolCurrentDataState = sliceState<poolsCurrentInfo>

export interface poolsCurrentDataArgs {
  contracts: contractsInfo
  trustlessMulticall: string
  rewardsInfo: rewardsInfo
  poolsMetadata: poolsMetadata
}

export const getPoolsCurrentData = createAsyncThunk(
  'poolsCurrentData/getPoolsCurrentData',
  async (args: poolsCurrentDataArgs): Promise<poolsCurrentInfo> => {
    const provider = getProvider()
    const prices = getContract(args.contracts[ProtocolContract.Prices], ProtocolContract.Prices) as Prices
    const rewards = getContract(args.contracts[ProtocolContract.Rewards], ProtocolContract.Rewards) as Rewards
    const accounting = getContract(args.contracts[ProtocolContract.Accounting], ProtocolContract.Accounting) as Accounting
    const trustlessMulticall = getMulticallContract(args.trustlessMulticall)
    const poolContract = new Contract(zeroAddress, poolArtifact.abi, provider) as UniswapV3Pool

    const poolAddresses = Object.keys(args.poolsMetadata)

    const {
      sqrtPriceX96Instant,
      tickTwapped,
      currentRewardsInfo,
      rs,
      poolsLiquidity
    } = await executeMulticalls(
      trustlessMulticall,
      {
        sqrtPriceX96Instant: manyContractOneFunctionMC(
          poolContract,
          idToIdAndNoArg(poolAddresses),
          'slot0',
          rc.String,
        ),
        tickTwapped: oneContractOneFunctionMC(
          prices,
          'calculateInstantTwappedTick',
          rc.Number,
          Object.fromEntries(poolAddresses.map(address => [address, [address, args.rewardsInfo.twapDuration]]))
        ),
        currentRewardsInfo: oneContractManyFunctionMC(
          rewards,
          {
            lastPeriodGlobalRewardsAccrued: rc.BigNumberToNumber,
            currentPeriod: rc.BigNumberToNumber,
          }
        ),
        rs: oneContractOneFunctionMC(
          accounting,
          'getRewardStatus',
          (result: any) => result as PromiseType<ReturnType<Accounting['getRewardStatus']>>,
          idToIdAndArg(poolAddresses),
        ),
        poolsLiquidity: oneContractOneFunctionMC(
          accounting,
          'poolLiquidity',
          rc.BigNumberToString,
          idToIdAndArg(poolAddresses),
        ),
      }
    )

    return Object.fromEntries(poolAddresses.map(address => [address, {
      instantTick: sqrtPriceX96ToTick(sqrtPriceX96Instant[address]),
      twapTick: tickTwapped[address],
      poolLiquidity: poolsLiquidity[address],
      cumulativeLiquidity: rs[address].cumulativeLiquidity.toString(),
      totalRewards: rs[address].totalRewards.toString(),
      lastPeriodGlobalRewardsAccrued: currentRewardsInfo.lastPeriodGlobalRewardsAccrued,
      currentPeriod: currentRewardsInfo.currentPeriod,
    }]))
  }
)

export const poolsCurrentDataSlice = createSlice({
  name: 'poolsCurrentData' ,
  initialState: initialState as poolCurrentDataState,
  reducers: {
    clearPoolsCurrentData: (state) => {
      state.data.value = null
    },
  },
  extraReducers: (builder) => {
    builder = getGenericReducerBuilder(builder, getPoolsCurrentData)
  },
})

export const { clearPoolsCurrentData } = poolsCurrentDataSlice.actions

export default poolsCurrentDataSlice.reducer
