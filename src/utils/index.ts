import { BigNumber } from "ethers";

export const isDevEnvironment = process.env.NODE_ENV === 'development';

export const sleepS = (seconds: number) => {
  return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

export const unscale = (quantity: BigNumber): number =>
  quantity.eq(0) ? 0 : Number(BigInt(quantity.toString()) / BigInt(1e12)) / 1e6;

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

// ======================= Math ============================
export const log = (input: { base: number; val: number }) =>
  Math.log(input.val) / Math.log(input.base);
