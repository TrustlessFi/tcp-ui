import { Contract } from 'ethers'

import { getPoolMetadataArgs, poolsMetadata } from './'
import { ProtocolContract } from '../contracts'
import getProvider from '../../utils/getProvider'
import { zeroAddress, unique, feeToFee, PromiseType } from '../../utils/'
import getContract, { getMulticallContract } from '../../utils/getContract'
import { executeMulticalls, rc, getDuplicateContractMulticall, getDuplicateFuncMulticall, contractFunctionSelector, selectorToContractFunction } from '@trustlessfi/multicall'

import { ProtocolDataAggregator, Rewards, UniswapV3Pool } from '../../utils/typechain/'

import poolArtifact from '../../utils/artifacts/@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json'
import erc20Artifact from '../../utils/artifacts/@openzeppelin/contracts/token/ERC20/ERC20.sol/ERC20.json'
import { uint255Max , bnf } from '../../utils/index';

export const fetchPoolMetadata = async (args: getPoolMetadataArgs): Promise<poolsMetadata> => {
    const provider = getProvider()
    const protocolDataAggregator = getContract(args.ProtocolDataAggregator, ProtocolContract.ProtocolDataAggregator) as ProtocolDataAggregator
    const rewards = getContract(args.Rewards, ProtocolContract.Rewards) as Rewards
    const trustlessMulticall = getMulticallContract(args.TrustlessMulticall)

    // TODO make this into it's own node and cache for 30 minutes
    const poolConfigs = await protocolDataAggregator.getIncentivizedPools()

    const tokenCalls = poolConfigs.map(config => ['token0', 'token1'].map(func => contractFunctionSelector(config.pool, func))).flat()
    const feeCalls = poolConfigs.map(config => contractFunctionSelector(config.pool, 'fee'))
    const slot0Calls = poolConfigs.map(config => contractFunctionSelector(config.pool, 'slot0'))

    let totalRewardsPortion = 0
    poolConfigs.map(config => totalRewardsPortion += config.rewardsPortion.toNumber())

    const poolContract = new Contract(zeroAddress, poolArtifact.abi, provider) as UniswapV3Pool

    const { poolInfo, poolIDs, sqrtPriceX96s } = await executeMulticalls(
      trustlessMulticall,
      {
        poolInfo: getDuplicateContractMulticall(
          poolContract,
          {
            ...Object.fromEntries(tokenCalls.map(tokenCall => [tokenCall, rc.String])),
            ...Object.fromEntries(feeCalls.map(feeCall => [feeCall, rc.Number])),
          }
        ),
        sqrtPriceX96s: getDuplicateContractMulticall(
          poolContract,
          {
            ...Object.fromEntries(slot0Calls.map(call => [
              call,
              rc.BigNumberToString,
            ])),
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
        balance: getDuplicateContractMulticall(
          tokenContract,
          Object.fromEntries(uniqueTokens.map(address => [contractFunctionSelector(address as string, 'balanceOf'), rc.BigNumberUnscale])),
          Object.fromEntries(uniqueTokens.map(address => [contractFunctionSelector(address as string, 'balanceOf'), [args.userAddress]])),
        ),
        approval: getDuplicateContractMulticall(
          tokenContract,
          Object.fromEntries(uniqueTokens.map(address => [contractFunctionSelector(address as string, 'allowance'), rc.BigNumberToString])),
          Object.fromEntries(uniqueTokens.map(address => [contractFunctionSelector(address as string, 'allowance'), [args.userAddress, args.Rewards]])),
        ),
      },
    )

    const result = Object.fromEntries(poolConfigs.map(poolConfig => {
      const fee = poolInfo[contractFunctionSelector(poolConfig.pool, 'fee')] as number
      const sqrtPriceX96 = sqrtPriceX96s[contractFunctionSelector(poolConfig.pool, 'slot0')] as string

      const token0Address = poolInfo[contractFunctionSelector(poolConfig.pool, 'token0')] as string
      const token1Address = poolInfo[contractFunctionSelector(poolConfig.pool, 'token1')] as string

      const token0Symbol = tokenInfo.symbol[contractFunctionSelector(token0Address, 'symbol')]
      const token1Symbol = tokenInfo.symbol[contractFunctionSelector(token1Address, 'symbol')]

      const token0Name = tokenInfo.name[contractFunctionSelector(token0Address, 'name')]
      const token1Name = tokenInfo.name[contractFunctionSelector(token1Address, 'name')]

      const token0Decimals = tokenInfo.decimals[contractFunctionSelector(token0Address, 'decimals')]
      const token1Decimals = tokenInfo.decimals[contractFunctionSelector(token1Address, 'decimals')]

      const token0Balance = tokenInfo.balance[contractFunctionSelector(token0Address, 'balance')]
      const token1Balance = tokenInfo.balance[contractFunctionSelector(token1Address, 'balance')]

      const token0Approval = tokenInfo.approval[contractFunctionSelector(token0Address, 'allowance')]
      const token1Approval = tokenInfo.approval[contractFunctionSelector(token1Address, 'allowance')]

      // TODO split out pricesqrt price, rewards approval, prices.twappedtick and user balance into something that only
      //  loads on opening a particular pool, so all of this can be cached
      return [
        poolConfig.pool,
        {
          fee: feeToFee(fee),
          rewardsPortion: (poolConfig.rewardsPortion.toNumber() * 100) / totalRewardsPortion,
          poolID: poolIDs[poolConfig.pool],
          address: poolConfig.pool,
          sqrtPriceX96,
          token0: {
            info: {
              address: token0Address,
              name: token0Name,
              symbol: token0Symbol,
              decimals: token0Decimals,
            },
            rewardsApproval: {
              allowance: token0Approval,
              approving: false,
              approved: bnf(token0Approval).gt(uint255Max)
            },
            userBalance: token0Balance,
          },
          token1: {
            info: {
              address: token1Address,
              name: token1Name,
              symbol: token1Symbol,
              decimals: token1Decimals,
            },
            rewardsApproval: {
              allowance: token1Approval,
              approving: false,
              approved: bnf(token1Approval).gt(uint255Max)
            },
            userBalance: token1Balance,
          },
        }
      ]
    }))

    return result
  }
