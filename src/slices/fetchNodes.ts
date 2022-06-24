import { NonNullValues, sliceState } from './'

import { balances } from './balances'
import { chainIDState } from './chainID'
import { contractsInfo } from './contracts'
import { currentChainInfo } from './currentChainInfo'
import { counterInfo } from './counter'
import { governorInfo } from './governor'
import { liquidityPageState } from './liquidityPage'
import { liquidationsInfo } from './liquidations'
import { marketInfo } from './market'
import { onboardingState } from './onboarding'
import { poolsCurrentData } from './poolsCurrentData'
import { poolsMetadata } from './poolsMetadata'
import { positions } from './positions'
import { pricesInfo } from './prices'
import { ratesInfo } from './rates'
import { truEthInfo } from './truEth'
import { rewardsInfo } from './rewards'
import { rootContracts } from './rootContracts'
import { sdi } from './systemDebt'
import { notificationState } from './notifications'
import { stakingState } from './staking'
import { tabsState } from './tabs'
import { tcpAllocationInfo } from './tcpAllocation'
import { tcpTimelockInfo } from './tcpTimelock'
import { testnetBannerState } from './testnetBanner'
import { TransactionState } from './transactions'
import { walletState } from './wallet'

export type RootState = {
  chainID: chainIDState
  rootContracts: rootContracts | null
  userAddress: string | null
  notifications: notificationState
  onboarding: onboardingState
  transactions: TransactionState
  testnetBanner: testnetBannerState
  liquidityPage: liquidityPageState
  staking: stakingState
  tabs: tabsState
  wallet: walletState

  balances: sliceState<balances>
  contracts: sliceState<contractsInfo>
  counterInfo: sliceState<counterInfo>
  currentChainInfo: sliceState<currentChainInfo>
  governorInfo: sliceState<governorInfo>
  liquidationsInfo: sliceState<liquidationsInfo>
  marketInfo: sliceState<marketInfo>
  poolsCurrentData: sliceState<poolsCurrentData>
  poolsMetadata: sliceState<poolsMetadata>
  positions: sliceState<positions>
  pricesInfo: sliceState<pricesInfo>
  ratesInfo: sliceState<ratesInfo>
  truEthInfo: sliceState<truEthInfo>
  rewardsInfo: sliceState<rewardsInfo>
  sdi: sliceState<sdi>
  tcpAllocation: sliceState<tcpAllocationInfo>
  tcpTimelock: sliceState<tcpTimelockInfo>
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
