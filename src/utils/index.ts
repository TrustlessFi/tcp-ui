import { Token } from '@uniswap/sdk-core';
import { BigNumber, BigNumberish, utils } from "ethers";
//import { BigNumber as UniswapBigNumber } from "../components/uniswap/node_modules/@ethersproject/bignumber"

import { USDC, USDT } from '../components/uniswap/src/constants/tokens';
import { LiquidityPosition } from '../slices/liquidityPositions';
import { SerializedError } from '@reduxjs/toolkit'

export const zeroAddress = '0x0000000000000000000000000000000000000000'

export const isDevEnvironment = process.env.NODE_ENV === 'development'

export const sleepS = (seconds: number) => {
  return new Promise(resolve => setTimeout(resolve, seconds * 1000))
}

// ======================= Number Utils ============================
export const log = (input: { base: number; val: number }) =>
  Math.log(input.val) / Math.log(input.base)

export const bnf = (val: BigNumberish) => BigNumber.from(val)

export const scale = (quantity: number, decimals = 18): BigNumber => bnf(mnt(quantity, decimals))

export const mnt = (quantity: number, decimals = 18): string => {
  if (decimals < 6) throw new Error('too few decimals: ' + decimals)
  return (BigInt(Math.round(quantity * 1e6))).toString() + '0'.repeat(decimals - 6)
}

export const numVal = (num: string | number): number => typeof num == 'string' ? parseFloat(num) : num

type direction = 'up' | 'down'

export const onNumChange = (numChangeFunc: (val: number) => void) => (
  _evt: React.ChangeEvent<HTMLInputElement> | React.MouseEvent<HTMLButtonElement>,
  direction: direction | {direction: direction, value: string | number } ,
  value: number | string ,
) => {
  if (typeof direction === 'string') numChangeFunc(numVal(value))
  else numChangeFunc(numVal(direction.value))
}

export const abbreviateAddress = (address: string) => address.substr(0, 6) + '...' + address.substr(address.length - 4, 4)

export const toChecksumAddress = (address: string) => utils.getAddress(address)

export const unscale = (quantity: BigNumber, decimals = 18): number => {
  const digits = quantity.toString().length
  let digitsToRemove = digits - 15
  if (digitsToRemove > decimals) {
    throw new Error('number too large')
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
  return (Math.floor(time / periodLength)) - firstPeriod
}

export const toInt = (val: number | string) => typeof val === 'number' ? val : parseInt(val)

export const anyNull = (items: (any | null)[]) => items.some(item => item === null)

// ======================= Number Display Utils ============================
export const roundToXDecimals = (val: number, decimals: number = 0) => {
  const result = (Math.round(val * 10 ** decimals) / 10 ** decimals).toString()
  if (decimals === 0) return result
  else {
    const decimalPointIndex = result.lastIndexOf('.')
    if (decimalPointIndex === -1) return result
    const decimalCount = result.substr(result.lastIndexOf('.') + 1).length
    if (decimalCount < decimals) return result + '0'.repeat(decimals - decimalCount)
    else return result
  }
}

export const addCommas = (val: number | string): string => {
  if (typeof val === 'number') val = val.toString()
  return val.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")
}

export const zeroIfNaN = (val: number) => isNaN(val) ? 0 : val

export const numDisplay = (
  val: number,
  decimals: number | null = null
): string => {
  if (isNaN(val)) return "-"
  if (decimals === null) {
    let logVal = Math.floor(log({ val: Math.abs(val), base: 10 }))
    decimals = Math.min(logVal > -1 ? 0 : Math.abs(logVal), 6) + 2
  }
  if (isNaN(val) || !isFinite(val)) return "-"
  return addCommas(roundToXDecimals(val, decimals))
}

// ======================= Constants ============================
export const uint256Max = '115792089237316195423570985008687907853269984665640564039457584007913129639935'
export const uint255Max = '57896044618658097711785492504343953926634992332820282019728792003956564819967'

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
export const assertUnreachable = (_x: never): never => { throw new Error('Didn\'t expect to get here') }

export const enforce = (conditional: boolean, errorMessage: string) => {
  if (!conditional) throw errorMessage
}

// ======================= Time ============================
export const years = (years: number)     => years * days(365)
export const weeks = (weeks: number)     => weeks * days(7)
export const days = (days: number)       => days * hours(24)
export const hours = (hours: number)     => hours * minutes(60)
export const minutes = (minutes: number) => minutes * seconds(60)
export const seconds = (seconds: number) => seconds

export const timeMS = () => (new Date().getTime())

export const timeS = () => Math.floor(timeMS() / 1000)

// ======================= Local Storage ============================
export const getLocalStorage = (key: string, defaultValue: any = null) => {
  const rawValue = localStorage.getItem(key)

  if (rawValue === null) {
    return defaultValue
  }

  const sliceStateWithExpiration = JSON.parse(rawValue)

  if (sliceStateWithExpiration.expiration < timeS()) {
    localStorage.removeItem(key)
    return defaultValue
  }

  return sliceStateWithExpiration.sliceState
}

export const randomInRange = (min: number, max: number) => Math.floor(Math.random() * (max - min) + min)

export const firstOrNull = <T>(array: Array<T>): T | null => {
  if (array.length === 0) return null
  return array[0]
}

export const first = <T>(array: Array<T>): T => {
  enforce(array.length > 0, 'First for empty array')
  return array[0]
}

export const last = <T>(array: Array<T>): T => {
  enforce(array.length > 0, 'Last for empty array')
  return array[array.length - 1]
}


export type PromiseType<T> = T extends PromiseLike<infer U> ? U : T
// type PromiseType = PromiseType<typeof promisedOne> // => number


export const parseMetamaskError = (error: any): string[] => {
  if (error.hasOwnProperty('data')) {
    if (error.data.hasOwnProperty('message')) {
      return [error.data.message as string]
    }
  }

  const userRejectedMessage = ['Please re-submit the transaction and accept it in Metamask.']

  if (error.hasOwnProperty('code') && error.code === 4001) {
    return userRejectedMessage
  }

  if (error.hasOwnProperty('message')) {
    if ((error.message as string).indexOf('{') === -1) return [error.message]
    const message = error.message as string
    const begin = message.indexOf('{')
    const end = message.lastIndexOf('}')
    if (end < begin ) return [message]

    const jsonString = message.substr(begin, (end - begin)+ 1)
    const innerObject = JSON.parse(jsonString)
    if (innerObject.hasOwnProperty('message')) return [innerObject.message]
    if (innerObject.hasOwnProperty('value')) {
      const innerObjectValue = innerObject.value
      if (innerObjectValue.hasOwnProperty('data')) {
        const innerObjectValueData = innerObjectValue.data
        const code = innerObjectValueData.hasOwnProperty('code') ? innerObjectValueData.code as number : null
        if (code === 4001) return userRejectedMessage
        if (innerObjectValueData.hasOwnProperty('message')) {
          const returnData = [innerObjectValueData.message]
          if (code !== null) returnData.push('Metamask error code ' + code + ')')
          return returnData
        }
      }
    }
  }

  return ['Unknown metamask error']
}

const zeroThroughF = [ '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', ]

export const isTxHash = (hash: string) => {
  if (hash.length !== 66) return false
  if (hash.substr(0, 2) !== '0x' ) return false
  if (hash.toLowerCase().substr(2).split('').filter(letter => zeroThroughF.includes(letter)).length != 64) return false
  return true
}

export const xor = (a: boolean, b: boolean) => ( a || b ) && !( a && b )


export const equalArrays = (a: any[], b: any[]) => {
  if (a.length !== b.length) return false
  return a.filter((aItem, index) => aItem !== b[index] ).length === 0
}

export const equalStrings = (a: string, b: string) => {
  return equalArrays(a.split(''), b.split(''))
}

export const equalStringsCaseInsensitive = (a: string, b: string) => {
  return equalArrays(a.toLowerCase().split(''), b.toLowerCase().split(''))
}
