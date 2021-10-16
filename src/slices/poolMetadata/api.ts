import { Contract } from 'ethers'

import { getPoolMetadataArgs, poolsInfo } from './'
import { ProtocolContract } from '../contracts'
import getProvider from '../../utils/getProvider'
import { zeroAddress, unique } from '../../utils/'
import getContract, { getMulticallContract } from '../../utils/getContract'
import { executeMulticalls, rc, getDuplicateContractMulticall, contractFunctionSelector, selectorToContractFunction } from '@trustlessfi/multicall'

import { ProtocolDataAggregator } from '../../utils/typechain/'

import poolArtifact from '../../utils/artifacts/@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json'
import erc20Artifact from '../../utils/artifacts/@openzeppelin/contracts/token/ERC20/ERC20.sol/ERC20.json'

export const fetchPoolMetadata = async (args: getPoolMetadataArgs): Promise<poolsInfo> => {
    const provider = getProvider()
    const protocolDataAggregator = getContract(args.ProtocolDataAggregator, ProtocolContract.ProtocolDataAggregator) as ProtocolDataAggregator
    const trustlessMulticall = getMulticallContract(args.TrustlessMulticall)


    // TODO make this into it's own node and cache for 30 minutes
    const poolConfigs = await protocolDataAggregator.getIncentivizedPools()

    const tokenCalls = poolConfigs.map(config => ['token0', 'token1'].map(func => contractFunctionSelector(config.pool, func))).flat()
    const feeCalls = poolConfigs.map(config => contractFunctionSelector(config.pool, 'fee'))

    let totalRewardsPortion = 0
    poolConfigs.map(config => totalRewardsPortion += config.rewardsPortion.toNumber())

    const { poolInfo } = await executeMulticalls(
      trustlessMulticall,
      {
        poolInfo: getDuplicateContractMulticall(
          new Contract(zeroAddress, poolArtifact.abi, provider),
          {
            ...Object.fromEntries(tokenCalls.map(tokenCall => [tokenCall, rc.String])),
            ...Object.fromEntries(feeCalls.map(feeCall => [feeCall, rc.Number])),
          }

        ),
      }
    )

    const uniqueTokens =
      unique(
        Object.entries(poolInfo).map(([id, value]) =>
          selectorToContractFunction(id).func === 'token0' || selectorToContractFunction(id).func === 'token1' ? null : value as string)
        .filter(value => value !== null)) as string[]

    const { tokenSymbols } = await executeMulticalls(
      trustlessMulticall,
      {
        tokenSymbols: getDuplicateContractMulticall(
          new Contract(zeroAddress, erc20Artifact.abi, provider),
          Object.fromEntries(uniqueTokens.map(address => [contractFunctionSelector(address as string, 'symbol'), rc.String])),
        ),
      }
    )

    const result = Object.fromEntries(poolConfigs.map(poolConfig => {
      const fee = poolInfo[contractFunctionSelector(poolConfig.pool, 'fee')] as number
      const token0Address = poolInfo[contractFunctionSelector(poolConfig.pool, 'token0')] as string
      const token1Address = poolInfo[contractFunctionSelector(poolConfig.pool, 'token1')] as string
      const token0Symbol = tokenSymbols[contractFunctionSelector(token0Address as string, 'symbol')]
      const token1Symbol = tokenSymbols[contractFunctionSelector(token1Address as string, 'symbol')]

      return [
        poolConfig.pool,
        {
          fee,
          rewardsPortion: (poolConfig.rewardsPortion.toNumber() * 100) / totalRewardsPortion,
          token0: { address: token0Address, symbol: token0Symbol },
          token1: { address: token1Address, symbol: token1Symbol },
        }
      ]
    }))

    return result
  }
