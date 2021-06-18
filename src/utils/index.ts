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
