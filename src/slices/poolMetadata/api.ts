import { Contract } from 'ethers'

import { getPoolsMetadataArgs, poolsMetadata } from './'
import { ProtocolContract } from '../contracts'
import getProvider from '../../utils/getProvider'
import { zeroAddress, unique, feeToFee } from '../../utils/'
import getContract, { getMulticallContract } from '../../utils/getContract'
import { executeMulticalls, rc, getDuplicateContractMulticall, getDuplicateFuncMulticall, contractFunctionSelector, selectorToContractFunction } from '@trustlessfi/multicall'

import { ProtocolDataAggregator, Rewards, UniswapV3Pool } from '../../utils/typechain/'

import poolArtifact from '../../utils/artifacts/@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json'
import erc20Artifact from '../../utils/artifacts/@openzeppelin/contracts/token/ERC20/ERC20.sol/ERC20.json'

export const fetchPoolMetadata = async (args: getPoolsMetadataArgs): Promise<poolsMetadata> => {
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

    const result = Object.fromEntries(poolConfigs.map(poolConfig => {
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
          fee: feeToFee(fee),
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

    return result
  }
