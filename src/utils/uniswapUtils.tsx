import { BigNumber } from 'ethers';
import { Token as UniswapToken } from '@uniswap/sdk-core';
import { Pool as UniswapPool } from '@uniswap/v3-sdk';
import { PositionDetails as UniswapPosition } from '../components/uniswap/src/types/position';

import { LiquidityPosition } from '../slices/liquidityPositions';
import { SerializedUniswapPool, SerializedUniswapToken } from '../slices/pools/index';
import { bnf } from './';

export const positionToUniswapPosition = (
  position: LiquidityPosition,
  flatPool: SerializedUniswapPool
): UniswapPosition => {
    const pool = inflateUniswapPool(flatPool)

    return {
        nonce: position.nonce,
        tokenId: BigNumber.from(0), // TODO supply this
        operator: position.owner,
        token0: pool.token0.address,
        token1: pool.token1.address,
        fee: pool.fee,
        tickLower: position.tickLower,
        tickUpper: position.tickUpper,
        liquidity: BigNumber.from(position.liquidity),
        feeGrowthInside0LastX128: BigNumber.from(0), // TODO supply this
        feeGrowthInside1LastX128: BigNumber.from(0), // TODO supply this
        slot0: {
            liquidity: position.liquidity.toNumber(),
            sqrtPriceX96: bnf(pool.sqrtRatioX96.toString()),
            tick: pool.tickCurrent
        },
        tokensOwed0: position.tokensOwed0,
        tokensOwed1: position.tokensOwed1,
    };
};

export const inflateUniswapToken = (pool: SerializedUniswapToken) => {
  return new UniswapToken(pool.chainID, pool.address, pool.decimals, pool.symbol, pool.name)
}

export const inflateUniswapPool = (pool: SerializedUniswapPool) => {
    return new UniswapPool(
        inflateUniswapToken(pool.tokenA),
        inflateUniswapToken(pool.tokenB),
        pool.fee,
        pool.sqrtRatioX96,
        pool.liquidity,
        pool.tickCurrent,
    )
}
