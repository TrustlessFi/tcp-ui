import { ethers } from 'ethers'

import { LiquidityPool, poolArgs, poolsArgs } from './'
import { ProtocolContract } from '../contracts'
import { unscale } from '../../utils'
import getProvider from '../../utils/getProvider'
import getContract from '../../utils/getContract'

import { ERC20 } from '../../utils/typechain/ERC20'
import { Rewards } from '../../utils/typechain/Rewards'
import { ProtocolDataAggregator } from '../../utils/typechain/ProtocolDataAggregator'
import { UniswapV3Pool } from '../../utils/typechain/UniswapV3Pool'

import erc20Artifact from '../../utils/artifacts/@openzeppelin/contracts/token/ERC20/ERC20.sol/ERC20.json'
import poolArtifact from '../../utils/artifacts/@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json'

interface PoolCache { [key: string]: LiquidityPool }

const poolCache: PoolCache = {}

export const fetchLiquidityPool = async (data: poolArgs): Promise<LiquidityPool> => {
    const rewards = getContract(data.Rewards, ProtocolContract.Rewards) as Rewards
    const poolAddress = await rewards.poolConfigForPoolID(data.poolID)
    return getPoolInformationForAddress(poolAddress.pool)
}

export const getPoolInformationForAddress = async (poolAddress: string): Promise<LiquidityPool> => {
    const pool = poolCache[poolAddress]

    if (pool) return pool

    const provider = getProvider()

    const poolContract = new ethers.Contract(poolAddress, poolArtifact.abi, provider) as UniswapV3Pool

    const [
        fee,
        liquidity,
        [sqrtPriceX96, tick, observationIndex, observationCardinality, observationCardinalityNext, feeProtocol, unlocked],
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
        token0Decimals,
        token0Symbol,
        token1Decimals,
        token1Symbol
    ] = await Promise.all([
        token0.decimals(),
        token0.symbol(),
        token1.decimals(),
        token1.symbol()
    ])

    const poolInfo = {
        address: poolContract.address,
        fee,
        liquidity: unscale(liquidity),
        slot0: {
            sqrtPriceX96,
            tick,
            observationIndex,
            observationCardinality,
            observationCardinalityNext,
            feeProtocol,
            unlocked
        },
        token0Address: token0.address,
        token0Decimals,
        token0Symbol,
        token1Address: token1.address,
        token1Decimals,
        token1Symbol
    } as LiquidityPool

    poolCache[poolAddress] = poolInfo

    return poolInfo
}

export const fetchPools = async (data: poolsArgs): Promise<LiquidityPool[]> => {
    console.log('getting pda', data)
    const protocolDataAggregator = getContract(data.ProtocolDataAggregator, ProtocolContract.ProtocolDataAggregator) as ProtocolDataAggregator
    console.log('got pda')

    console.log('getting configs')
    const poolConfigs = await protocolDataAggregator?.getIncentivizedPools()
    console.log('got poolConfigs')

    if (!poolConfigs || poolConfigs.length === 0) return []

    return Promise.all(poolConfigs.map(config => getPoolInformationForAddress(config.pool)))
}
