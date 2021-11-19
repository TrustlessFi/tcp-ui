import { BigNumber, BigNumberish, utils } from "ethers"
import { ChainID } from '@trustlessfi/addresses'
import JSBI from "jsbi"
import { TickMath } from '@uniswap/v3-sdk'
import { poolMetadata } from '../slices/poolsMetadata'

export const zeroAddress = '0x0000000000000000000000000000000000000000'

export const isDevEnvironment = process.env.NODE_ENV === 'development'

export const sleepS = (seconds: number) => {
  return new Promise(resolve => setTimeout(resolve, seconds * 1000))
}

// ======================= Number Utils ============================
export const log = (input: { base: number; val: number }) =>
  Math.log(input.val) / Math.log(input.base)

export const ONE = BigNumber.from('1000000000000000000')

export const Q96 = BigNumber.from(BigInt(2**96))

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

// ======================= Transactions =========================
export const getDefaultTransactionTimeout = (chainID: ChainID) => chainID === ChainID.Hardhat ? 60 * 2000 : 60 * 20
export const SLIPPAGE_TOLERANCE = 0.05

// ======================= Constants ============================
export const uint256Max = '115792089237316195423570985008687907853269984665640564039457584007913129639935'
export const uint255Max = '57896044618658097711785492504343953926634992332820282019728792003956564819967'

// ======================= Typescript ============================
export type Nullable<T> = { [K in keyof T]: T[K] | null }

// ======================= Uniswap Data Formatting ============================
export const assertUnreachable = (_x: never): never => { throw new Error('Didn\'t expect to get here') }

export const enforce = (conditional: boolean, errorMessage: string) => {
  if (!conditional) throw new Error(errorMessage)
}

// ======================= Time ============================
export const years = (years: number)     => years * days(365)
export const weeks = (weeks: number)     => weeks * days(7)
export const days = (days: number)       => days * hours(24)
export const hours = (hours: number)     => hours * minutes(60)
export const minutes = (minutes: number) => minutes * seconds(60)
export const seconds = (seconds: number) => seconds

export const timeMS = () => Date.now()

export const msToS = (ms: number) => Math.floor(ms / 1000)

export const timeS = () => msToS(timeMS())

// ======================= Local Storage ============================
export const getLocalStorage = (key: string, defaultValue: any = null) => {
  const rawValue = localStorage.getItem(key)

  if (rawValue === null) return defaultValue

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

export const unique = <T>(array: Array<T>): Array<T> =>
  array.filter((value: T, index: number) => array.indexOf(value) === index)

export const arrayToObject = (array: Array<unknown>) =>
  Object.fromEntries(array.map((value, index) => [index, value]))

export type PromiseType<T> = T extends PromiseLike<infer U> ? U : T
// type PromiseType = PromiseType<typeof promisedOne> // => number


export const parseMetamaskError = (error: any): string[] => {
  const metamaskError = error
  if (error.hasOwnProperty('error')) error = error.error

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

  console.error({metamaskError})
  return ['Unknown metamask error']

}

export const upperCaseWord = (word: string) => word.length === 0
  ? word
  : word.substr(0, 1).toUpperCase() + word.substr(1).toLowerCase()

const zeroThroughF = [ '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', ]

export const isTxHash = (hash: string) => {
  if (hash.length !== 66) return false
  if (hash.substr(0, 2) !== '0x' ) return false
  if (hash.toLowerCase().substr(2).split('').filter(letter => zeroThroughF.includes(letter)).length !== 64) return false
  return true
}

export const xor = (a: boolean, b: boolean) => ( a || b ) && !( a && b )


export const equalArrays = (a: any[], b: any[]) =>
  a.length !== b.length
    ? false
    : a.filter((aItem, index) => aItem !== b[index] ).length === 0

export const equalStrings = (a: string, b: string) =>
  equalArrays(a.split(''), b.split(''))

export const equalStringsCaseInsensitive = (a: string, b: string) =>
  equalArrays(a.toLowerCase().split(''), b.toLowerCase().split(''))


// ======================= UNISWAP ============================
export const getE18PriceForSqrtX96Price = (sqrtPriceX96: BigNumber) => {
  const sqrtPriceE18 = sqrtPriceX96.mul(ONE).div(Q96)
  return sqrtPriceE18.mul(sqrtPriceE18).div(ONE)
}

export enum Fee {
  LOW = 500,
  DEFAULT = 3000,
  HIGH = 10000,
}

export const getSpaceForFee = (fee: Fee) => {
  switch (fee) {
    case Fee.LOW:
      return 10
    case Fee.DEFAULT:
      return 60
    case Fee.HIGH:
      return 200
    default:
      return 10
  }
}

export const feeToFee = (fee: number): Fee => {
  if (fee in Fee) return fee as Fee
  else throw new Error('invalid fee: ' + fee)
}

export const tickToSqrtPriceX96 = (tick: number) => bnf(TickMath.getSqrtRatioAtTick(tick).toString())

export const sqrtPriceX96ToTick = (sqrtPriceX96: string) => TickMath.getTickAtSqrtRatio(JSBI.BigInt(sqrtPriceX96))

export const tickToPrice = (tick: number): number => unscale(getE18PriceForSqrtX96Price(tickToSqrtPriceX96(tick)))

export const tickToPriceDisplay = (tick: number) => numDisplay(tickToPrice(tick))

export const displaySymbol = (value?: string) => {
  if(!value) {
    return ''
  }

  return value.toLowerCase() === 'weth' ? 'Eth' : upperCaseWord(value)
}

export const getPoolName = (pool?: poolMetadata | null) => {
  if(!pool) {
    return '-'
  }

  const token0Symbol = displaySymbol(pool.token0.symbol)
  const token1Symbol = displaySymbol(pool.token1.symbol)

  return `${token0Symbol}:${token1Symbol}`
}

export const maxLiquidityForAmount0 = (sqrtRatioAX96: BigNumber, sqrtRatioBX96: BigNumber, amount0: BigNumber) => {
  if (sqrtRatioAX96.gt(sqrtRatioBX96)) [sqrtRatioAX96, sqrtRatioBX96] = [sqrtRatioBX96, sqrtRatioAX96]

  const numerator = amount0.mul(sqrtRatioAX96).mul(sqrtRatioBX96)
  const denominator = Q96.mul(sqrtRatioBX96.sub(sqrtRatioAX96))

  return numerator.div(denominator)
}

export const maxLiquidityForAmount1 = (sqrtRatioAX96: BigNumber, sqrtRatioBX96: BigNumber, amount1: BigNumber) => {
  if (sqrtRatioAX96.gt(sqrtRatioBX96)) [sqrtRatioAX96, sqrtRatioBX96] = [sqrtRatioBX96, sqrtRatioAX96]

  return (amount1.mul(Q96)).div(sqrtRatioBX96.sub(sqrtRatioAX96))
}

export const getAmount0ForLiquidity = (priceA: BigNumber, priceB: BigNumber, liquidity: BigNumber) => {
  if (priceA > priceB) [priceA, priceB] = [priceB, priceA]

  return liquidity.mul(Q96).mul(priceB.sub(priceA)).div(priceB).div(priceA)
}

export const getAmount1ForLiquidity = (priceA: BigNumber, priceB: BigNumber, liquidity: BigNumber) => {
  if (priceA > priceB) [priceA, priceB] = [priceB, priceA]

  return liquidity.mul(priceB.sub(priceA)).div(Q96)
}

export const getAmountsForLiquidity = (
  currentTick: number,
  lowerTick: number,
  upperTick: number,
  liquidity: BigNumber
): {amount0: BigNumber, amount1: BigNumber} => {
  const result = {amount0: BigNumber.from(0), amount1: BigNumber.from(0)}

  const currentPrice = tickToSqrtPriceX96(currentTick)
  let priceA = tickToSqrtPriceX96(lowerTick)
  let priceB = tickToSqrtPriceX96(upperTick)

  if (priceA > priceB) [priceA, priceB] = [priceB, priceA]

  if (currentPrice.lte(priceA)) {
    result.amount0 = getAmount0ForLiquidity(priceA, priceB, liquidity)
  } else if (currentPrice.lt(priceB)) {
    result.amount0 = getAmount0ForLiquidity(currentPrice, priceB, liquidity)
    result.amount1 = getAmount1ForLiquidity(priceA, currentPrice, liquidity)
  } else {
    result.amount1 = getAmount1ForLiquidity(priceA, priceB, liquidity)
  }
  return result
}

export const getAmount1ForAmount0 = (amount0: BigNumber, currentTick: number, lowerTick: number, upperTick: number) => {
  enforce(lowerTick < currentTick, 'Get Amount 1: tick error lower')
  enforce(currentTick < upperTick, 'Get Amount 1: tick error upper')
  const price = tickToSqrtPriceX96(currentTick)
  let priceA = tickToSqrtPriceX96(lowerTick)
  let priceB = tickToSqrtPriceX96(upperTick)

  if (priceA > priceB) [priceA, priceB] = [priceB, priceA]

  const numerator = price.sub(priceA).mul(amount0)

  const denominator1 = Q96.mul(Q96).div(price)
  const denominator2 = Q96.mul(Q96).div(priceB)

  return numerator.div(denominator1.sub(denominator2))
}

export const getAmount0ForAmount1 = (amount1: BigNumber, currentTick: number, lowerTick: number, upperTick: number) => {
  const price = tickToSqrtPriceX96(currentTick)
  let priceLower = tickToSqrtPriceX96(lowerTick)
  let priceUpper = tickToSqrtPriceX96(upperTick)
  if (priceLower > priceUpper) [priceLower, priceUpper] = [priceUpper, priceLower]

  enforce(priceLower < price, 'Get Amount 0: tick error lower')
  enforce(currentTick < upperTick, 'Get Amount 0: tick error upper')

  const numerator1 = Q96.mul(Q96).div(price)
  const numerator2 = Q96.mul(Q96).div(priceUpper)
  const denominator = price.sub(priceLower)

  return (numerator1.sub(numerator2)).mul(amount1).div(denominator)
}
