import { ChainID } from '@trustlessfi/addresses'
import { NonNullValues } from './'

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
import { sdi } from './systemDebt'

export interface FetchNodes {
  chainID: ChainID,
  governor: string,
  protocolDataAggregator: string,
  trustlessMulticall: string,
  userAddress: string,

  balances: balances,
  contracts: contractsInfo,
  currentChainInfo: currentChainInfo,
  governorInfo: governorInfo,
  liquidationsInfo: liquidationsInfo,
  liquidityPositions: liquidityPositions,
  marketInfo: marketInfo,
  poolsCurrentData: poolsCurrentData
  poolsMetadata: poolsMetadata
  positions: positions
  pricesInfo: pricesInfo
  ratesInfo: ratesInfo
  rewardsInfo: rewardsInfo
  sdi: sdi
}

export type FetchNode = keyof FetchNodes

const fetchNodes: {[node in keyof FetchNodes]: FetchNodes[node] | null} = {
  chainID: null,
  governor: null,
  protocolDataAggregator: null,
  trustlessMulticall: null,
  userAddress: null,

  balances: null,
  contracts: null,
  currentChainInfo: null,
  governorInfo: null,
  liquidationsInfo: null,
  liquidityPositions: null,
  marketInfo: null,
  poolsCurrentData: null,
  poolsMetadata: null,
  positions: null,
  pricesInfo: null,
  ratesInfo: null,
  rewardsInfo: null,
  sdi: null,
}


export type thunkDependencies<R extends FetchNode> = Pick<typeof fetchNodes, R>

export type thunkArgs<R extends FetchNode> = NonNullValues<thunkDependencies<R>>

export const getThunkDependencies = <R extends FetchNode>(val: R[]) =>
  Object.fromEntries(val.map(key => [key, fetchNodes[key]])) as thunkDependencies<R>
