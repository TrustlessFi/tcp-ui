import { Pool, Position } from '@uniswap/v3-sdk'
import JSBI from 'jsbi';
import { Token } from '@uniswap/sdk-core'
import { PositionDetails } from 'types/position'
import { useCurrency } from './Tokens'

export function useDerivedPositionInfo(positionDetails: PositionDetails | undefined): {
  position: Position | undefined
  pool: Pool | undefined
} {
  const currency0 = useCurrency(positionDetails?.token0)
  const currency1 = useCurrency(positionDetails?.token1)

  // construct pool data
  const pool = positionDetails && currency0 && currency1 && new Pool(
    currency0 as Token,
    currency1 as Token,
    positionDetails.fee,
    JSBI.BigInt(positionDetails.slot0.sqrtPriceX96),
    JSBI.BigInt(positionDetails.liquidity),
    positionDetails.slot0.tick
  );

  let position = undefined
  if (pool && positionDetails) {
    position = new Position({
      pool,
      liquidity: positionDetails.liquidity.toString(),
      tickLower: positionDetails.tickLower,
      tickUpper: positionDetails.tickUpper,
    })
  }

  return {
    position,
    pool: pool ?? undefined,
  }
}
