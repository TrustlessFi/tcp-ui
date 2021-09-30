import { BigNumber } from 'ethers';
import { Token as UniswapToken } from '@uniswap/sdk-core';
import { Pool as UniswapPool } from '@uniswap/v3-sdk';
import { PositionDetails as UniswapPosition } from '../components/uniswap/src/types/position';

import { ChainID } from '../slices/chainID';
import { LiquidityPosition } from '../slices/liquidityPositions';
import { LiquidityPool } from '../slices/pools';

export const poolToUniswapPool = (chainId: ChainID, pool: LiquidityPool & { type?: string }): UniswapPool & { address?: string, type?: string } => {
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
    return {
        //pool: poolToUniswapPool(chainId, position.pool),
        fee: position.pool.fee,
        feeGrowthInside0LastX128: BigNumber.from(0),
        feeGrowthInside1LastX128: BigNumber.from(0),
        liquidity: BigNumber.from(position.liquidity),
        nonce: position.nonce,
        operator: position.owner,
        slot0: {
            liquidity: position.liquidity.toNumber(),
            ...position.pool.slot0,
        },
        tickLower: position.tickLower,
        tickUpper: position.tickUpper,
        token0: position.pool.token0Address,
        token1: position.pool.token1Address,
        tokenId: BigNumber.from(0),
        tokensOwed0: position.tokensOwed0,
        tokensOwed1: position.tokensOwed1,
    };
};
