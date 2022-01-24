import { ChainID } from '@trustlessfi/addresses'
import { NonNullValues, sliceState } from './'

import chainIDSlice from './chainID'
import userAddressSlice from './userAddress'
import balancesSlice, { balances } from './balances'
import contractsSlice, { contractsInfo } from './contracts'
import currentChainInfoSlice, { currentChainInfo } from './currentChainInfo'
import governorSlice, { governorInfo } from './governor'
import liquidationsSlice, { liquidationsInfo } from './liquidations'
import liquidityPositionsSlice,{ liquidityPositions } from './liquidityPositions'
import marketSlice, { marketInfo } from './market'
import poolsCurrentDataSlice, { poolsCurrentData } from './poolsCurrentData'
import poolsMetadataSlice, { poolsMetadata } from './poolsMetadata'
import positionsSlice, { positions } from './positions'
import pricesSlice, { pricesInfo } from './prices'
import ratesSlice, { ratesInfo } from './rates'
import rewardsSlice, { rewardsInfo } from './rewards'
import rootContractsSlice, { rootContracts } from './rootContracts'
import systemDebtSlice, { sdi } from './systemDebt'
import uniswapContractsSlice, { uniswapContracts } from './uniswapContracts'
import notificationsSlice, { notificationState } from './notifications'
import transactionsSlice, { TransactionState } from './transactions'
import walletSlice, { wallet } from './wallet'

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

// TODO enforce that all keys are present
export const allSlices = {
  chainID: chainIDSlice,
  rootContracts: rootContractsSlice,
  userAddress: userAddressSlice,
  notifications: notificationsSlice,
  transactions: transactionsSlice,
  wallet: walletSlice,

  balances: balancesSlice,
  contracts: contractsSlice,
  currentChainInfo: currentChainInfoSlice,
  governorInfo: governorSlice,
  liquidationsInfo: liquidationsSlice,
  liquidityPositions: liquidityPositionsSlice,
  marketInfo: marketSlice,
  poolsCurrentData: poolsCurrentDataSlice,
  poolsMetadata: poolsMetadataSlice,
  positions: positionsSlice,
  pricesInfo: pricesSlice,
  ratesInfo: ratesSlice,
  rewardsInfo: rewardsSlice,
  sdi: systemDebtSlice,
  uniswapContracts: uniswapContractsSlice,
}


export type thunkDependencies<R extends FetchNode> = {[node in keyof Pick<RootState, R>]: sliceStateValues[node]}

export type thunkArgs<R extends FetchNode> = NonNullValues<thunkDependencies<R>>

export const getThunkDependencies = <R extends FetchNode>(val: R[]) =>
  Object.fromEntries(val.map(key => [key, null])) as thunkDependencies<R>
