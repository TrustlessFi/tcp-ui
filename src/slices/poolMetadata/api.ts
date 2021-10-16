import { Contract } from 'ethers'

import { getPoolMetadataArgs, poolsInfo } from './'
import { ProtocolContract } from '../contracts'
import getProvider from '../../utils/getProvider'
import { zeroAddress, unique } from '../../utils/'
import getContract, { getMulticallContract } from '../../utils/getContract'
import { executeMulticalls, rc, getDuplicateContractMulticall, contractFunctionSelector } from '@trustlessfi/multicall'

import { ProtocolDataAggregator } from '../../utils/typechain/'

import poolArtifact from '../../utils/artifacts/@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json'
import erc20Artifact from '../../utils/artifacts/@openzeppelin/contracts/token/ERC20/ERC20.sol/ERC20.json'

export const fetchPoolMetadata = async (args: getPoolMetadataArgs): Promise<poolsInfo> => {
    const provider = getProvider()
    const protocolDataAggregator = getContract(args.ProtocolDataAggregator, ProtocolContract.ProtocolDataAggregator) as ProtocolDataAggregator
    const trustlessMulticall = getMulticallContract(args.TrustlessMulticall)

    // TODO make this into it's own node and cache for 30 minutes
    const poolAddresses = (await protocolDataAggregator.getIncentivizedPools()).map(config => config.pool)

    const calls = poolAddresses.map(pool => contractFunctionSelector(pool, 'token0')).concat(
      poolAddresses.map(pool => contractFunctionSelector(pool, 'token1')))

    const { tokenAddresses } = await executeMulticalls(
      trustlessMulticall,
      {
        tokenAddresses: getDuplicateContractMulticall(
          new Contract(zeroAddress, poolArtifact.abi, provider),
          Object.fromEntries(calls.map(call => [call, rc.String])),
        ),
      }
    )

    const uniqueTokens = unique(Object.values(tokenAddresses))

    const { tokenSymbols } = await executeMulticalls(
      trustlessMulticall,
      {
        tokenSymbols: getDuplicateContractMulticall(
          new Contract(zeroAddress, erc20Artifact.abi, provider),
          Object.fromEntries(uniqueTokens.map(address => [contractFunctionSelector(address, 'symbol'), rc.String])),
        ),
      }
    )

    return Object.fromEntries(poolAddresses.map(poolAddress => {
      const token0Address = tokenAddresses[contractFunctionSelector(poolAddress, 'token0')]
      const token1Address = tokenAddresses[contractFunctionSelector(poolAddress, 'token1')]
      const token0Symbol = tokenSymbols[contractFunctionSelector(token0Address, 'symbol')]
      const token1Symbol = tokenSymbols[contractFunctionSelector(token1Address, 'symbol')]

      return [
        poolAddress,
        {
          token0: { address: token0Address, symbol: token0Symbol },
          token1: { address: token1Address, symbol: token1Symbol },
        }
      ]
    }))
  }
