import { AsyncThunk } from "@reduxjs/toolkit"
import { AppDispatch, store, RootState } from '../app/store'
import { ChainID } from "@trustlessfi/addresses"
import { AppSelector } from '../app/hooks'
import { getGovernorInfo, governorInfo } from './governor'
import { getMarketInfo, marketInfo } from './market'
import { getRatesInfo, ratesInfo } from './rates'
import { getPoolsMetadata, poolsMetadata } from './poolsMetadata'
import { getPoolsCurrentData, poolsCurrentInfo } from './poolsCurrentData'
import { getLiquidityPositions } from './liquidityPositions'
import { getPositions } from './positions'
import { getSystemDebtInfo, systemDebtInfo } from './systemDebt'
import { getLiquidationsInfo, liquidationsInfo } from './liquidations'
import { getRewardsInfo, rewardsInfo } from './rewards'
import { getPricesInfo } from './prices'
import { getBalances } from './balances'
import { getContracts, contractsInfo } from './contracts'

import { sliceState } from './'

interface fetchNodeTypes {
  chainID: ChainID
  governor: string
  trustlessMulticall: string
  protocolDataAggregator: string
  userAddress: string

  governorInfo: governorInfo
  liquidationsInfo: liquidationsInfo
  rewardsInfo: rewardsInfo
  marketInfo: marketInfo
  ratesInfo: ratesInfo
  poolsMetadata: poolsMetadata
  poolsCurrentData: poolsCurrentInfo
  sdi: systemDebtInfo
  contracts: contractsInfo
}

const getWaitFunction = <
    Dependency extends keyof fetchNodeTypes,
    Args extends Pick<fetchNodeTypes, Dependency>,
    Value
  >(
    stateSelector: (state: RootState) => sliceState<Value>,
    thunk: AsyncThunk<Value, Args, {}>,
    dependencies: Dependency[]
  ) => (selector: AppSelector, dispatch: AppDispatch) => {
    const state = selector(stateSelector)

    const inputArgs = Object.fromEntries(dependencies.map(fetchNode =>
      [fetchNode, (() => fetchNodesImpl)()[fetchNode](selector, dispatch)]
    ))

    if (Object.values(inputArgs).includes(null)) return null

    if (state !== undefined && state.error !== null) {
      console.error(state.error.message)
      throw state.error
    }

    if (
      state === undefined ||
      (state.value === null && !stateSelector(store.getState()).loading)
    ) {
      dispatch(thunk(inputArgs as NonNullable<Args>))
    }

    return state === undefined ? null : state.value
  }

type FetchNode = keyof fetchNodeTypes


/// ============================ Get Contracts Logic =======================================
export const waitForContracts = getWaitFunction(
  (state: RootState) => state.contracts,
  getContracts,
  ['governor', 'trustlessMulticall'],
)

export const waitForPoolsCurrentData = getWaitFunction(
  (state: RootState) => state.poolsCurrentData,
  getPoolsCurrentData,
  [
    'contracts',
    'trustlessMulticall',
    'rewardsInfo',
    'poolsMetadata',
  ],
)

/// ============================ Get Info Logic =======================================
export const waitForGovernor = getWaitFunction(
  (state: RootState) => state.governor,
  getGovernorInfo,
  ['governor'],
)

export const waitForPrices = getWaitFunction(
  (state: RootState) => state.prices,
  getPricesInfo,
  ['contracts', 'liquidationsInfo', 'trustlessMulticall'],
)

export const waitForMarket = getWaitFunction(
  (state: RootState) => state.market,
  getMarketInfo,
  ['contracts', 'trustlessMulticall'],
)

export const waitForPositions = getWaitFunction(
  (state: RootState) => state.positions,
  getPositions,
  ['userAddress', 'sdi', 'marketInfo', 'contracts', 'trustlessMulticall'],
)

export const waitForLiquidations = getWaitFunction(
  (state: RootState) => state.liquidations,
  getLiquidationsInfo,
  ['contracts', 'trustlessMulticall'],
)

export const waitForRewards = getWaitFunction(
  (state: RootState) => state.rewards,
  getRewardsInfo,
  ['contracts', 'trustlessMulticall'],
)

export const waitForRates = getWaitFunction(
  (state: RootState) => state.rates,
  getRatesInfo,
  ['contracts', 'trustlessMulticall'],
)

export const waitForSDI = getWaitFunction(
  (state: RootState) => state.systemDebt,
  getSystemDebtInfo,
  ['contracts'],
)

export const waitForBalances = getWaitFunction(
  (state: RootState) => state.balances,
  getBalances,
  [
    'userAddress',
    'trustlessMulticall',
    'poolsMetadata',
    'rewardsInfo',
    'contracts',
  ]
)

export const waitForLiquidityPositions = getWaitFunction(
  (state: RootState) => state.liquidityPositions,
  getLiquidityPositions,
  [
    'userAddress',
    'contracts',
    'trustlessMulticall',
    'poolsCurrentData',
    'poolsMetadata',
    'rewardsInfo',
  ],
)

export const waitForPoolsMetadata = getWaitFunction(
  (state: RootState) => state.poolsMetadata,
  getPoolsMetadata,
  ['protocolDataAggregator', 'trustlessMulticall', 'contracts'],
)

const getStateSelector = <T>(selectorFunc: (state: RootState) => T) =>
  (selector: AppSelector, _dispatch: AppDispatch) => selector(selectorFunc)

const fetchNodesImpl: {[key in FetchNode]: (selector: AppSelector, _dispatch: AppDispatch) => fetchNodeTypes[key] | null} = {
  chainID: getStateSelector(state => state.chainID.chainID),
  governor: getStateSelector(state => state.chainID.governor),
  trustlessMulticall: getStateSelector(state => state.chainID.trustlessMulticall),
  protocolDataAggregator: getStateSelector(state => state.chainID.protocolDataAggregator),
  userAddress: getStateSelector(state => state.wallet.address),

  governorInfo: waitForGovernor,
  liquidationsInfo: waitForLiquidations,
  rewardsInfo: waitForRewards,
  marketInfo: waitForMarket,
  ratesInfo: waitForRates,
  poolsMetadata: waitForPoolsMetadata,
  poolsCurrentData: waitForPoolsCurrentData,
  sdi: waitForSDI,
  contracts: waitForContracts,
}
