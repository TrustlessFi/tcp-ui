import { Token } from '@uniswap/sdk-core';
import { BigNumber, BigNumberish } from "ethers";
//import { BigNumber as UniswapBigNumber } from "../components/uniswap/node_modules/@ethersproject/bignumber"

import { USDC, USDT } from '../components/uniswap/src/constants';
import { LiquidityPosition } from '../slices/liquidityPositions';

export const zeroAddress = '0x0000000000000000000000000000000000000000';

export const isDevEnvironment = process.env.NODE_ENV === 'development';

export const sleepS = (seconds: number) => {
  return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

// ======================= Number Utils ============================
export const log = (input: { base: number; val: number }) =>
  Math.log(input.val) / Math.log(input.base);

export const bnf = (val: BigNumberish) => BigNumber.from(val);

export const scale = (_quantity: BigNumberish, decimals = 18): BigNumber => {
  let quantity = bnf(_quantity)
  while (decimals > 6) {
    quantity = quantity.mul(1e6)
    decimals -= 6
  }
  return quantity.mul(10**decimals)
}

export const unscale = (quantity: BigNumber, decimals = 18): number => {
  const digits = quantity.toString().length
  let digitsToRemove = digits - 15
  if (digitsToRemove > decimals) {
    console.log({quantity: quantity.toString(), decimals, digits})
    throw 'number too large'
  }
  while(digitsToRemove > 9) {
    quantity = quantity.div(1e9)
    digitsToRemove -= 9
    decimals -= 9
  }
  let num = 0
  if (digitsToRemove > 0)  {
    decimals -= digitsToRemove
    num = quantity.div(10**digitsToRemove).toNumber()
  } else {
    num = quantity.toNumber()
  }
  const result = num / (10**decimals)
  return result
}

export const timeToPeriod = (time: number, periodLength: number, firstPeriod: number) => {
  return (Math.floor(time / periodLength)) - firstPeriod;
}

export const toInt = (val: number | string) => typeof val === 'number' ? val : parseInt(val)

// ======================= Number Display Utils ============================
export const roundToXDecimals = (val: number, decimals: number = 0) =>
  Math.round(val * 10 ** decimals) / 10 ** decimals;

export const addCommas = (val: number): string =>
  val.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");

export const numDisplay = (
  val: number,
  decimals: number | null = null
): string => {
  if (isNaN(val)) return "-";
  if (decimals === null) {
    let logVal = Math.floor(log({ val: Math.abs(val), base: 10 }));
    decimals = Math.min(logVal > -1 ? 0 : Math.abs(logVal), 6) + 2;
  }
  if (isNaN(val)) return "-";
  return addCommas(roundToXDecimals(val, decimals));
}

// ======================= Constants ============================
export const uint256Max = '115792089237316195423570985008687907853269984665640564039457584007913129639935';
export const uint255Max = '57896044618658097711785492504343953926634992332820282019728792003956564819967';



// ======================= Typescript ============================
export type Nullable<T> = { [K in keyof T]: T[K] | null }



// ======================= Uniswap Data Formatting ============================
const symbolToTokenMap: { [key: string]: any } = {
  USDC,
  USDT
};

type CombinedLiquidityPosition = LiquidityPosition & {
  amount0: {
    token: Token
  },
  amount1: {
    token: Token
  },
  fee: number,
  feeGrowthInside0LastX128: BigNumber,
  feeGrowthInside1LastX128: BigNumber,
  nonce: BigNumber,
  operator: string,
  slot0: any,
  token0: string,
  token1: string,
  tokenId: BigNumber,
  tokensOwed0: BigNumber,
  tokensOwed1: BigNumber,
}

export const formatPositionForUniswap = (position: LiquidityPosition): CombinedLiquidityPosition => ({
  ...position,
  amount0: {
      token: symbolToTokenMap[position.pool.token0Symbol]
  },
  amount1: {
      token: symbolToTokenMap[position.pool.token1Symbol]
  },
  fee: position.pool.fee,
  liquidity: BigNumber.from(position.liquidity),
  nonce: position.nonce,
  feeGrowthInside0LastX128: BigNumber.from(0),//position.feeGrowthInside0LastX128,
  feeGrowthInside1LastX128: BigNumber.from(0),//position.feeGrowthInside1LastX128,
  operator: position.owner,
  slot0: {
      ...position.pool.slot0,
      sqrtPriceX96: position.pool.slot0.sqrtPriceX96
  },
  token0: position.pool.token0Address,
  token1: position.pool.token1Address,
  tokenId: BigNumber.from(position.id),
  tokensOwed0: position.tokensOwed0,
  tokensOwed1: position.tokensOwed1
})