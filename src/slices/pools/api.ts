import { Contract } from 'ethers'

import { getPoolsArgs, poolsInfo } from './'
import { ProtocolContract } from '../contracts'
import getProvider from '../../utils/getProvider'
import getContract, { getMulticallContract } from '../../utils/getContract'
import { executeMulticalls, getMulticall, rc } from '@trustlessfi/multicall'
import { PromiseType } from '@trustlessfi/utils'

import { unique } from '../../utils/'

import { ProtocolDataAggregator, ERC20, UniswapV3Pool, TrustlessMulticallViewOnly } from '../../utils/typechain/'

import erc20Artifact from '../../utils/artifacts/@openzeppelin/contracts/token/ERC20/ERC20.sol/ERC20.json'
import poolArtifact from '../../utils/artifacts/@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json'

export const fetchPools = async (args: getPoolsArgs): Promise<poolsInfo> => {
    const provider = getProvider()
    const protocolDataAggregator = getContract(args.ProtocolDataAggregator, ProtocolContract.ProtocolDataAggregator) as ProtocolDataAggregator
    const trustlessMulticall = getMulticallContract(args.TrustlessMulticall)

    const poolAddresses = await protocolDataAggregator.getIncentivizedPools()
    const pools = poolAddresses.map(config => new Contract(config.pool, poolArtifact.abi, provider) as UniswapV3Pool)

    const poolData = await executeMulticalls(
      trustlessMulticall,
      Object.fromEntries(pools.map(pool => [
        pool.address,
        getMulticall(
          pool,
          {
            token0: rc.String,
            token1: rc.String,
            liquidity: rc.BigNumberToString,
            slot0: (result: any) => result as PromiseType<ReturnType<UniswapV3Pool['slot0']>>,
          }
        ),
      ]))
    )
    const tokens =
      unique(
        Object.values(poolData).map(pool => pool.token0).concat(
          Object.values(poolData).map(pool => pool.token1))
      ).map(tokenAddress => new Contract(tokenAddress, erc20Artifact.abi, provider) as ERC20)

    const tokenData = await executeMulticalls(
      trustlessMulticall,
      Object.fromEntries(tokens.map(token => [
        token.address,
        getMulticall(
          token,
          {
            name: rc.String,
            symbol: rc.String,
            decimals: rc.Number,
          }
        ),
      ]))
    )

    const result =  Object.fromEntries(Object.entries(poolData).map(([poolAddress, poolDatum]) => ([
      poolAddress,
      {
        token0: {...tokenData[poolDatum.token0], address: poolDatum.token0},
        token1: {...tokenData[poolDatum.token1], address: poolDatum.token1},
        sqrtRatioX96: poolDatum.slot0.sqrtPriceX96.toString(),
        liquidity: poolDatum.liquidity,
        tickCurrent: poolDatum.slot0.tick,
      }
    ])))

    return result

  }
