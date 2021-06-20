import { BigNumber, BigNumberish } from "ethers";

export const isDevEnvironment = process.env.NODE_ENV === 'development';

export const sleepS = (seconds: number) => {
  return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

// ======================= Number Utils ============================
export const log = (input: { base: number; val: number }) =>
  Math.log(input.val) / Math.log(input.base);

export const bnf = (val: BigNumberish) => BigNumber.from(val);

export const unscale = (quantity: BigNumber): number =>
  quantity.eq(0) ? 0 : Number(BigInt(quantity.toString()) / BigInt(1e12)) / 1e6;

export const scale = (quantity: BigNumberish): BigNumber => bnf(quantity).mul(1e9).mul(1e9)

export const timeToPeriod = (time: number, periodLength: number, firstPeriod: number) => {
  return (Math.floor(time / periodLength)) - firstPeriod;
}

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
