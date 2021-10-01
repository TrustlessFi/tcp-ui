import { ethers } from 'ethers'

import { getPoolsArgs, poolsInfo, SerializedUniswapPool } from './'
import { Pool as UniswapPool } from '@uniswap/v3-sdk'
import { Token as UniswapToken } from '@uniswap/sdk-core';
import { ProtocolContract } from '../contracts'
import getProvider from '../../utils/getProvider'
import getContract from '../../utils/getContract'
import { inflateUniswapToken} from '../../utils/uniswapUtils'

import { ERC20 } from '../../utils/typechain/ERC20'
import { ProtocolDataAggregator } from '../../utils/typechain/ProtocolDataAggregator'
import { UniswapV3Pool } from '../../utils/typechain/UniswapV3Pool'

import erc20Artifact from '../../utils/artifacts/@openzeppelin/contracts/token/ERC20/ERC20.sol/ERC20.json'
import poolArtifact from '../../utils/artifacts/@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json'
import { ChainID } from '../chainID/index';
import { BigNumber } from 'ethers'

export const getPool = async (
  poolConfig: {pool: string, rewardsPortion: BigNumber},
  chainID: ChainID
): Promise<SerializedUniswapPool> => {
    const provider = getProvider()
    const poolContract = new ethers.Contract(poolConfig.pool, poolArtifact.abi, provider) as UniswapV3Pool

    const [
        fee,
        liquidity,
        [sqrtRatioX96, tickCurrent, _observationIndex, _observationCardinality, _observationCardinalityNext, _feeProtocol, _unlocked],
        token0Address,
        token1Address,
    ] = await Promise.all([
        poolContract.fee(),
        poolContract.liquidity(),
        poolContract.slot0(),
        poolContract.token0(),
        poolContract.token1(),
    ])

    const token0 = new ethers.Contract(token0Address, erc20Artifact.abi, provider) as ERC20
    const token1 = new ethers.Contract(token1Address, erc20Artifact.abi, provider) as ERC20

    const [
      token0Name,
      token0Symbol,
      token0Decimals,
      token1Name,
      token1Symbol,
      token1Decimals,
    ] = await Promise.all([
      token0.name(),
      token0.symbol(),
      token0.decimals(),
      token1.name(),
      token1.symbol(),
      token1.decimals(),
    ])

    return {
      tokenA: {
        chainID,
        address: token0.address,
        name: token0Name,
        symbol: token0Symbol,
        decimals: token0Decimals,
      },
      tokenB: {
        chainID,
        address: token1.address,
        name: token1Name,
        symbol: token1Symbol,
        decimals: token1Decimals,
      },
      fee,
      sqrtRatioX96: sqrtRatioX96.toString(),
      liquidity: liquidity.toString(),
      tickCurrent,
    }
}

export const fetchPools = async (args: getPoolsArgs): Promise<poolsInfo> => {
    const protocolDataAggregator = getContract(args.ProtocolDataAggregator, ProtocolContract.ProtocolDataAggregator) as ProtocolDataAggregator

    const poolConfigs = await protocolDataAggregator.getIncentivizedPools()

    const pools = await Promise.all(poolConfigs.map(poolConfig => getPool(poolConfig, args.chainID)))

    return Object.fromEntries(pools.map(pool =>
      [
        UniswapPool.getAddress(
          inflateUniswapToken(pool.tokenA),
          inflateUniswapToken(pool.tokenB),
          pool.fee
        ),
        pool
      ]
    ))
  }
