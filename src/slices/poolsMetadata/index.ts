import { Contract } from 'ethers'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { Fee } from '../../utils/'
import { sliceState, initialState, getGenericReducerBuilder } from '../'
import getProvider from '../../utils/getProvider';
import { ProtocolContract } from '../contracts/index';
import { executeMulticalls, rc, getDuplicateContractMulticall, getDuplicateFuncMulticall, contractFunctionSelector, selectorToContractFunction } from '@trustlessfi/multicall'
import getContract, { getMulticallContract } from '../../utils/getContract'

import erc20Artifact from '@trustlessfi/artifacts/dist/@openzeppelin/contracts/token/ERC20/ERC20.sol/ERC20.json'

import { ProtocolDataAggregator, Rewards, UniswapV3Pool } from '@trustlessfi/typechain/'
import poolArtifact from '@trustlessfi/artifacts/dist/@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json'
import { zeroAddress, unique } from '../../utils'

export interface getPoolsMetadataArgs {
  Rewards: string
  TrustlessMulticall: string
  ProtocolDataAggregator: string
  userAddress: string
}

export interface tokenMetadata {
  address: string
  name: string
  symbol: string
  decimals: number
}


export interface poolMetadata {
  fee: Fee
  rewardsPortion: number
  poolID: number
  address: string
  token0: tokenMetadata
  token1: tokenMetadata
}

export interface poolsMetadata {[key: string]: poolMetadata}

export interface PoolsMetadataState extends sliceState<poolsMetadata> {}


export const getPoolsMetadata = createAsyncThunk(
  'poolsMetadata/getPoolMetadata',
  async (args: getPoolsMetadataArgs): Promise<poolsMetadata> => {
    const provider = getProvider()
    const protocolDataAggregator = getContract(args.ProtocolDataAggregator, ProtocolContract.ProtocolDataAggregator) as ProtocolDataAggregator
    const rewards = getContract(args.Rewards, ProtocolContract.Rewards) as Rewards
    const trustlessMulticall = getMulticallContract(args.TrustlessMulticall)

    // TODO make this into it's own node and cache for 30 minutes
    const poolConfigs = await protocolDataAggregator.getIncentivizedPools()

    const tokenCalls = poolConfigs.map(config => ['token0', 'token1'].map(func => contractFunctionSelector(config.pool, func))).flat()
    const feeCalls = poolConfigs.map(config => contractFunctionSelector(config.pool, 'fee'))

    let totalRewardsPortion = 0
    poolConfigs.map(config => totalRewardsPortion += config.rewardsPortion.toNumber())

    const poolContract = new Contract(zeroAddress, poolArtifact.abi, provider) as UniswapV3Pool

    const { poolInfo, poolIDs } = await executeMulticalls(
      trustlessMulticall,
      {
        poolInfo: getDuplicateContractMulticall(
          poolContract,
          {
            ...Object.fromEntries(tokenCalls.map(tokenCall => [tokenCall, rc.String])),
            ...Object.fromEntries(feeCalls.map(feeCall => [feeCall, rc.Number])),
          }
        ),
        poolIDs: getDuplicateFuncMulticall(
          rewards,
          'poolIDForPool',
          rc.Number,
          Object.fromEntries(poolConfigs.map(config => [config.pool, [config.pool]]))
        ),
      }
    )


    const tokenContract = new Contract(zeroAddress, erc20Artifact.abi, provider)
    const uniqueTokens =
      unique(
        Object.entries(poolInfo).map(([id, value]) =>
          selectorToContractFunction(id).func !== 'token0' && selectorToContractFunction(id).func !== 'token1' ? null : value as string)
        .filter(value => value !== null)) as string[]
    const tokenInfo = await executeMulticalls(
      trustlessMulticall,
      {
        symbol: getDuplicateContractMulticall(
          tokenContract,
          Object.fromEntries(uniqueTokens.map(address => [contractFunctionSelector(address as string, 'symbol'), rc.String])),
        ),
        name: getDuplicateContractMulticall(
          tokenContract,
          Object.fromEntries(uniqueTokens.map(address => [contractFunctionSelector(address as string, 'name'), rc.String])),
        ),
        decimals: getDuplicateContractMulticall(
          tokenContract,
          Object.fromEntries(uniqueTokens.map(address => [contractFunctionSelector(address as string, 'decimals'), rc.Number])),
        ),
      },
    )

    return Object.fromEntries(poolConfigs.map(poolConfig => {
      const fee = poolInfo[contractFunctionSelector(poolConfig.pool, 'fee')] as number

      const token0Address = poolInfo[contractFunctionSelector(poolConfig.pool, 'token0')] as string
      const token1Address = poolInfo[contractFunctionSelector(poolConfig.pool, 'token1')] as string

      const token0Symbol = tokenInfo.symbol[contractFunctionSelector(token0Address, 'symbol')]
      const token1Symbol = tokenInfo.symbol[contractFunctionSelector(token1Address, 'symbol')]

      const token0Name = tokenInfo.name[contractFunctionSelector(token0Address, 'name')]
      const token1Name = tokenInfo.name[contractFunctionSelector(token1Address, 'name')]

      const token0Decimals = tokenInfo.decimals[contractFunctionSelector(token0Address, 'decimals')]
      const token1Decimals = tokenInfo.decimals[contractFunctionSelector(token1Address, 'decimals')]

      // TODO split out pricesqrt price, rewards approval, prices.twappedtick and user balance into something that only
      //  loads on opening a particular pool, so all of this can be cached
      return [
        poolConfig.pool,
        {
          fee,
          rewardsPortion: (poolConfig.rewardsPortion.toNumber() * 100) / totalRewardsPortion,
          poolID: poolIDs[poolConfig.pool],
          address: poolConfig.pool,
          token0: {
            address: token0Address,
            name: token0Name,
            symbol: token0Symbol,
            decimals: token0Decimals,
          },
          token1: {
            address: token1Address,
            name: token1Name,
            symbol: token1Symbol,
            decimals: token1Decimals,
          },
        }
      ]
    }))
  }
)

const name = 'poolsMetadata'

export const poolsMetadataSlice = createSlice({
  name,
  initialState: initialState as PoolsMetadataState,
  reducers: {},
  extraReducers: (builder) => {
    builder = getGenericReducerBuilder(builder, getPoolsMetadata)
  },
})

export default poolsMetadataSlice.reducer
