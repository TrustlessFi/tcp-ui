import { ChainID } from '@trustlessfi/addresses'
import { NonNullValues, sliceState } from './'

import { balances } from './balances'
import { contractsInfo } from './contracts'
import { currentChainInfo } from './currentChainInfo'
import { governorInfo } from './governor'
import { liquidationsInfo } from './liquidations'
import { liquidityPositions } from './liquidityPositions'
import { marketInfo } from './market'
import { poolsCurrentData } from './poolsCurrentData'
import { poolsMetadata } from './poolsMetadata'
import { positions } from './positions'
import { pricesInfo } from './prices'
import { ratesInfo } from './rates'
import { rewardsInfo } from './rewards'
import { rootContracts } from './rootContracts'
import { sdi } from './systemDebt'
import { uniswapContracts } from './uniswapContracts'
import { notificationState } from './notifications'
import { TransactionState } from './transactions'
import { wallet } from './wallet'

export type canBeNull<T> = T | null

export interface RootState {
  chainID: canBeNull<ChainID>
  rootContracts: canBeNull<rootContracts>
  userAddress: canBeNull<string>
  notifications: notificationState
  transactions: TransactionState
  wallet: wallet

  balances: sliceState<balances>
  contracts: sliceState<contractsInfo>
  currentChainInfo: sliceState<currentChainInfo>
  governorInfo: sliceState<governorInfo>
  liquidationsInfo: sliceState<liquidationsInfo>
  liquidityPositions: sliceState<liquidityPositions>
  marketInfo: sliceState<marketInfo>
  poolsCurrentData: sliceState<poolsCurrentData>
  poolsMetadata: sliceState<poolsMetadata>
  positions: sliceState<positions>
  pricesInfo: sliceState<pricesInfo>
  ratesInfo: sliceState<ratesInfo>
  rewardsInfo: sliceState<rewardsInfo>
  sdi: sliceState<sdi>
  uniswapContracts: sliceState<uniswapContracts>
}

export type FetchNode = keyof RootState

export type sliceStateValues = {
  [node in FetchNode]:
    RootState[node] extends sliceState<unknown>
    ? RootState[node]['value']
    : RootState[node]
}

export type thunkDependencies<R extends FetchNode> = {[node in keyof Pick<RootState, R>]: sliceStateValues[node]}

export type thunkArgs<R extends FetchNode> = NonNullValues<thunkDependencies<R>>

export const getThunkDependencies = <R extends FetchNode>(val: R[]) =>
  Object.fromEntries(val.map(key => [key, null])) as thunkDependencies<R>
