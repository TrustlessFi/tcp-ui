import { BigNumber, BigNumberish, utils } from "ethers"
import JSBI from "jsbi"
import { ERC20, ProtocolToken, UniswapV3Pool } from "@trustlessfi/typechain"
import { TickMath } from '@uniswap/v3-sdk'
import { poolMetadata } from '../slices/poolsMetadata'
import { contract } from './getContract'
import { v4 as uuid } from 'uuid'
import { Buffer } from 'buffer'


import erc20Artifact from '@trustlessfi/artifacts/dist/@openzeppelin/contracts/token/ERC20/ERC20.sol/ERC20.json'
import protocolTokenArtifact from '@trustlessfi/artifacts/dist/contracts/core/tokens/ProtocolToken.sol/ProtocolToken.json'
import poolArtifact from '@trustlessfi/artifacts/dist/@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json'

export const zeroAddress = '0x0000000000000000000000000000000000000000'

export const zkSyncEthERC20Address = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'

export const isDevEnvironment = process.env.NODE_ENV === 'development'

export const sleepS = (seconds: number) => new Promise(resolve => setTimeout(resolve, seconds * 1000))

// ======================= Number Utils ============================
export const log = (input: { base: number; val: number }) =>
  Math.log(input.val) / Math.log(input.base)

export const ONE = BigNumber.from('1000000000000000000')

export const Q96 = BigNumber.from(BigInt(2**96))

export const bnf = (val: BigNumberish) => BigNumber.from(val)

export const scale = (quantity: number, decimals = 18): BigNumber => bnf(mnt(quantity, decimals))

export const mnt = (quantity: number, decimals = 18): string => {
  if (isNaN(quantity)) return '0'
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

export const sum = (a: number, b: number) => a + b

export const range = (start: number, max: number, delta = 1 ): number[] => {
  const result: number[] = []
  for(; start <= max; start += delta) result.push(start)
  return result
}

export const unscale = (_quantity: BigNumber | string, decimals = 18): number => {
  let quantity = bnf(_quantity)
  if (quantity.isZero()) return 0
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
export const roundToXDecimals = (val: number, decimals: number = 0, floor = false) => {
  const result =
    floor
    ? (Math.floor(val * 10 ** decimals) / 10 ** decimals).toString()
    : (Math.round(val * 10 ** decimals) / 10 ** decimals).toString()
  if (decimals === 0) return result
  else {
    const decimalPointIndex = result.lastIndexOf('.')
    if (decimalPointIndex === -1) return result
    const decimalCount = result.substring(result.lastIndexOf('.') + 1).length
    if (decimalCount < decimals) return result + '0'.repeat(decimals - decimalCount)
    else return result
  }
}

export const addCommas = (val: number | string): string => {
  if (typeof val === 'number') val = val.toString()
  let parts = val.split(".")
  let whole = parts[0].split("")
  const start = whole.length - 3;
  const end = (whole[0] === '-') ? 2 : 1;
  for(let i = start; i >= end; i -= 3) {
    whole.splice(i, 0, ',')
  }
  parts[0] = whole.join("")
  return parts.join(".")
}

export const zeroIfNaN = (val: number) => isNaN(val) ? 0 : val

export const isZeroish = (val: any) => isNaN(val) || val === null || val === undefined || val === 0

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

export type IfEquals<T, U, Y=unknown, N=never> =
  (<G>() => G extends T ? 1 : 2) extends
  (<G>() => G extends U ? 1 : 2) ? Y : N;

export declare const exactType: <T, U>(
  draft: T & IfEquals<T, U>,
  expected: U & IfEquals<T, U>
) => IfEquals<T, U>

// ======================= Uniswap Data Formatting ============================
export const assertUnreachable = (_x: never): never => {
  throw new Error('Didn\'t expect to get here')
}

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


export const randomInRange = (min: number, max: number) => Math.floor(Math.random() * (max - min) + min)

export const firstOrNull = <T>(array: Array<T>) => {
  if (array.length === 0) return null
  return array[0]
}

export const first = <T>(array: Array<T>) => {
  enforce(array.length > 0, 'First for empty array')
  return array[0]
}

export const lastOrNull = <T>(array: Array<T>) => {
  if (array.length === 0) return null
  return array[array.length - 1]
}

export const last = <T>(array: Array<T>) => {
  enforce(array.length > 0, 'Last for empty array')
  return array[array.length - 1]
}

export const notEmpty = <T>(array: Array<T>) => array.length > 0

export const empty = <T>(array: Array<T>) => array.length === 0

export const unique = <T>(array: Array<T>): Array<T> =>
  array.filter((value: T, index: number) => array.indexOf(value) === index)

export const arrayToObject = (array: Array<unknown>) =>
  Object.fromEntries(array.map((value, index) => [index, value]))

/// TYPES
export type PromiseType<T> = T extends PromiseLike<infer U> ? U : T

export type Merge<A, B> = { [K in keyof (A | B)]: K extends keyof B ? B[K] : A[K] };


export const parseMetamaskError = (error: any): {messages: string[], code?: number } => {
  if (error.hasOwnProperty('error')) error = error.error

  if (error.hasOwnProperty('data')) {
    if (error.data.hasOwnProperty('message')) {
      return {messages: [error.data.message as string] }
    }
  }

  const userRejectedMessage = ['Please accept in Metamask']

  if (error.hasOwnProperty('code') && error.code === 4001) {
    return {messages: userRejectedMessage, code: error.code}
  }

  if (error.hasOwnProperty('message')) {
    if ((error.message as string).indexOf('{') === -1) return {messages: [error.message], code: error.code }
    const message = error.message as string
    const begin = message.indexOf('{')
    const end = message.lastIndexOf('}')
    if (end < begin ) return {messages: [message], code: error.code}

    const jsonString = message.substring(begin, (end - begin)+ 1)
    const innerObject = JSON.parse(jsonString)
    if (innerObject.hasOwnProperty('message')) return {messages: [innerObject.message], code: error.code}
    if (innerObject.hasOwnProperty('value')) {
      const innerObjectValue = innerObject.value
      if (innerObjectValue.hasOwnProperty('data')) {
        const innerObjectValueData = innerObjectValue.data
        const code = innerObjectValueData.hasOwnProperty('code') ? innerObjectValueData.code as number : null
        if (code === 4001) return {messages: userRejectedMessage, code: 4001 }
        if (innerObjectValueData.hasOwnProperty('message')) {
          const returnData = [innerObjectValueData.message]
          if (code !== null) returnData.push('Metamask error code ' + code + ')')
          return { messages: returnData }
        }
      }
    }
  }

  return {messages: ['Unknown metamask error']}
}

export const extractRevertReasonString  = (input: string): string | null => {
  const vmExceptionMessage = 'Error: VM Exception while processing transaction: reverted with reason string \''
  const messageIndex = input.indexOf(vmExceptionMessage)
  if (messageIndex < 0) return null
  const result = input.substring(vmExceptionMessage.length, input.lastIndexOf('\''))

  switch(result) {
    case 'STF':
      return 'Token transfer failed'
    default:
      return result
  }
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

export const getSpaceForFee = (fee: Fee): number => {
  switch (fee) {
    case Fee.LOW:
      return 10
    case Fee.DEFAULT:
      return 60
    case Fee.HIGH:
      return 200
  }
}

export const feeToFee = (fee: number): Fee => {
  if (fee in Fee) return fee as Fee
  else throw new Error(`invalid fee: ${fee}`)
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
  _liquidity: BigNumberish
): {amount0: BigNumber, amount1: BigNumber} => {
  const liquidity = bnf(_liquidity)
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

export type abi = { [key in string]: any }[]
export type contractArtifact = { abi: abi }

export const addressToERC20 = (address = zeroAddress) =>
  contract<ERC20>({address, abi: erc20Artifact.abi })

export const addressToProtocolToken = (address: string) =>
  contract<ProtocolToken>({address, abi: protocolTokenArtifact.abi })

export const addressToV3Pool = (address: string) =>
  contract<UniswapV3Pool>({address, abi: poolArtifact.abi })

export const sqrtBigNumber = (input: BigNumberish): BigNumber => {
  let y = bnf(input)
  let z = bnf(0)
  if (y.gt(3)) {
    z = y
    let x = (y.div(2)).add(1)
    while(x.lt(z)) {
      z = x
      x = ((y.div(x)).add(x)).div(2)
    }
  } else if (!y.isZero()) {
    z = bnf(1)
  }
  return z
}


export const numberToHex = (val: number) => '0x' + val.toString(16)

export const convertSVGtoURI = (svg: string) =>
  `data:image/svg+xml;base64,${Buffer.from(svg, 'binary').toString('base64')}`

export const getRecencyString = (timeInMS: number) => {
  const getRawString = (secondsAgo: number) => {
    if (secondsAgo <= 0) return 'now'
    if (secondsAgo < minutes(1)) return `${secondsAgo}s`
    if (secondsAgo < hours(1)) return `${Math.floor(secondsAgo / minutes(1))}m`
    if (secondsAgo < days(1)) return `${Math.floor(secondsAgo / hours(1))}h`
    if (secondsAgo < weeks(1)) return `${Math.floor(secondsAgo / days(1))}d`
    return `${Math.floor(secondsAgo / weeks(1))}d`
  }
  return `${getRawString(Math.round((timeMS() - timeInMS) / 1000))} ago`
}

// ======================= METAMASK API ============================
interface EthereumRequestArguments {
  method: string
  params?: unknown[] | object
}

interface ethereum {
  request: (args: EthereumRequestArguments) => Promise<unknown>
}

export enum RpcMethod {
  SwitchChain = 'wallet_switchEthereumChain',
  AddTokenToWallet = 'wallet_watchAsset',
  AddEthereumChain = 'wallet_addEthereumChain',
}

interface SwitchChainRequest {
  method: RpcMethod.SwitchChain
  chainId: string
}

interface AddTokenToWalletRequest {
  method: RpcMethod.AddTokenToWallet
  type: string
  options: {
    address: string
    symbol: string
    decimals: number
    image: string
  }
}

interface AddEthereumChainParameter {
  method: RpcMethod.AddEthereumChain
  chainId: string // A 0x-prefixed hexadecimal string
  chainName: string
  nativeCurrency: {
    name: string
    symbol: string // 2-6 characters long
    decimals: 18
  };
  rpcUrls: string[]
  blockExplorerUrls?: string[]
  iconUrls?: string[] // Currently ignored.
}


type RpcRequest =
  | SwitchChainRequest
  | AddTokenToWalletRequest
  | AddEthereumChainParameter

const requiresArray: {[key in RpcMethod]?: true} = {
  [RpcMethod.SwitchChain]: true,
  [RpcMethod.AddEthereumChain]: true,
}

export const makeRPCRequest = async (request: RpcRequest) => {
  const ethereum = window.ethereum as ethereum | undefined
  if (ethereum === undefined) return

  // strip method from the params
  const params = Object.fromEntries(Object.entries(request).filter(([key, _]) => key !== 'method'))

  const requestParams = {
    method: request.method,
    params: requiresArray[request.method] === true ? [params] : params,
  }

  return await ethereum.request(requestParams)
}

export const addTokenToWallet = async (
  options: AddTokenToWalletRequest['options']
) => {
  return await makeRPCRequest({
    method: RpcMethod.AddTokenToWallet,
    type: 'ERC20',
    options,
  })
}


export const reloadPage = () => window.location.reload()

export const isLocalhost = () =>
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'


export const getUUID = () => uuid()
