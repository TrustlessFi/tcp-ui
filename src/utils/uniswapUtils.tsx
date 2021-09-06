import { Token as UniswapToken } from '@uniswap/sdk-core';
import { Pool as UniswapPool, Position as UniswapPosition } from '@uniswap/v3-sdk';

import { ChainID } from '../slices/chainID';
import { LiquidityPosition } from '../slices/liquidityPositions';
import { LiquidityPool } from '../slices/pools';

export const poolToUniswapPool = (chainId: ChainID, pool: LiquidityPool & { type?: string }): UniswapPool & { address?: string, type?: string }=> {
    const uniswapPool = new UniswapPool(
        new UniswapToken(chainId, pool.token0Address, pool.token0Decimals, pool.token0Symbol),
        new UniswapToken(chainId, pool.token1Address, pool.token1Decimals, pool.token1Symbol),
        pool.fee,
        pool.slot0.sqrtPriceX96.toString(),
        pool.liquidity,
        pool.slot0.tick
    ) as UniswapPool & { address?: string, type?: string };

    if(pool.address) {
        uniswapPool.address = pool.address;
    }

    if(pool.type) {
        uniswapPool.type = pool.type;
    }

    return uniswapPool;
}

export const positionToUniswapPosition = (chainId: ChainID, position: LiquidityPosition): UniswapPosition => {
    return new UniswapPosition({
        pool: poolToUniswapPool(chainId, position.pool),
        liquidity: position.liquidity.toString(),
        tickLower: position.tickLower,
        tickUpper: position.tickUpper
    });
};