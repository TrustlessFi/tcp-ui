import { AsyncThunk } from '@reduxjs/toolkit'
import { AppDispatch, store, RootState } from '../app/store'
import { ChainID } from '@trustlessfi/addresses'
import { AppSelector } from '../app/hooks'
import { getGovernorInfo, governorInfo } from './governor'
import { getMarketInfo, marketInfo } from './market'
import { getRatesInfo, ratesInfo } from './rates'
import { getPoolsMetadata, poolsMetadata } from './poolsMetadata'
import { getPoolsCurrentData, poolsCurrentInfo } from './poolsCurrentData'
import { getLiquidityPositions, liquidityPositions } from './liquidityPositions'
import { getPositions, positionsInfo } from './positions'
import { getSystemDebtInfo, systemDebtInfo } from './systemDebt'
import { getLiquidationsInfo, liquidationsInfo } from './liquidations'
import { getRewardsInfo, rewardsInfo } from './rewards'
import { getPricesInfo, pricesInfo } from './prices'
import { getBalances, balancesInfo } from './balances'
import { getContracts, contractsInfo } from './contracts'
import { getCurrentChainInfo, currentChainInfo } from './currentChainInfo'

import { sliceState } from './'

const toNull = <T>() => null as T | null
const nullString = toNull<string>()

const fetchNodes = {
  chainID: toNull<ChainID>(),
  governor: nullString,
  protocolDataAggregator: nullString,
  trustlessMulticall: nullString,
  userAddress: nullString,

  balances: toNull<balancesInfo>(),
  contracts: toNull<contractsInfo>(),
  currentChainInfo: toNull<currentChainInfo>(),
  governorInfo: toNull<governorInfo>(),
  liquidationsInfo: toNull<liquidationsInfo>(),
  liquidityPositions: toNull<liquidityPositions>(),
  marketInfo: toNull<marketInfo>(),
  poolsCurrentData: toNull<poolsCurrentInfo>(),
  poolsMetadata: toNull<poolsMetadata>(),
  positions: toNull<positionsInfo>(),
  pricesInfo: toNull<pricesInfo>(),
  ratesInfo: toNull<ratesInfo>(),
  rewardsInfo: toNull<rewardsInfo>(),
  sdi: toNull<systemDebtInfo>(),
}

export type NonNull<O> = {
  [K in keyof O]-?: NonNullable<O[K]>
}

type FetchNodes = typeof fetchNodes
type FetchNode = keyof FetchNodes

const getWaitFunction = <
    Value,
    Dependencies extends Partial<{[fetchNode in keyof typeof fetchNodes]: (typeof fetchNodes)[fetchNode] | null}>,
  >(waitForData: {
    stateSelector: (state: RootState) => sliceState<Value>
    dependencies: Dependencies
    thunk: AsyncThunk<Value, NonNull<Dependencies>, {}>
  }) => (selector: AppSelector, dispatch: AppDispatch) => {
    const { stateSelector, thunk, dependencies} = waitForData
    const state = selector(stateSelector)

    const inputArgs = Object.fromEntries(Object.keys(dependencies).map(fetchNode =>
      [fetchNode, (() => waitForImpl)()[fetchNode as FetchNode](selector, dispatch)]
    )) as Dependencies

    if (Object.values(inputArgs).includes(null)) return null

    // TODO get rid of undefined checks
    if (state !== undefined && state.error !== null) {
      console.error(state.error.message)
      throw state.error
    }

    if (
      state === undefined ||
      (state.value === null && !stateSelector(store.getState()).loading)
    ) {
      dispatch(thunk(inputArgs as NonNull<Dependencies>))
    }

    return state === undefined ? null : state.value
  }

const allPossibleArgs =
  Object.fromEntries(
    Object.entries(fetchNodes)
      .map(([key, _val]) => [key, null])
  ) as { [key in FetchNode]: FetchNodes[key] }

export const getThunkDependencies = <R extends FetchNode>(val: R[]) =>
  Object.fromEntries(val.map(key => [key, allPossibleArgs[key]])) as Pick<typeof allPossibleArgs, R>


const getStateSelector = <T>(selectorFunc: (state: RootState) => T) =>
  (selector: AppSelector, _dispatch: AppDispatch) => selector(selectorFunc)

const waitForImpl: {[key in FetchNode]: (selector: AppSelector, _dispatch: AppDispatch) => FetchNodes[key]} = {
  chainID: getStateSelector(state => state.chainID.chainID),
  governor: getStateSelector(state => state.chainID.governor),
  protocolDataAggregator: getStateSelector(state => state.chainID.protocolDataAggregator),
  trustlessMulticall: getStateSelector(state => state.chainID.trustlessMulticall),
  userAddress: getStateSelector(state => state.wallet.address),

  balances: getWaitFunction(getBalances),
  contracts: getWaitFunction(getContracts),
  currentChainInfo: getWaitFunction(getCurrentChainInfo),
  governorInfo: getWaitFunction(getGovernorInfo),
  liquidationsInfo: getWaitFunction(getLiquidationsInfo),
  liquidityPositions: getWaitFunction(getLiquidityPositions),
  marketInfo: getWaitFunction(getMarketInfo),
  poolsCurrentData: getWaitFunction(getPoolsCurrentData),
  poolsMetadata: getWaitFunction(getPoolsMetadata),
  positions: getWaitFunction(getPositions),
  pricesInfo: getWaitFunction(getPricesInfo),
  ratesInfo: getWaitFunction(getRatesInfo),
  rewardsInfo: getWaitFunction(getRewardsInfo),
  sdi: getWaitFunction(getSystemDebtInfo),
}

const waitFor = <RequestedNodes extends FetchNode>(
  requestedNodes: RequestedNodes[],
  selector: AppSelector,
  dispatch: AppDispatch
) => Object.fromEntries(
  requestedNodes.map(fetchNode => [fetchNode, waitForImpl[fetchNode](selector, dispatch)])
) as { [requestedNode in RequestedNodes]: FetchNodes[requestedNode]}

export default waitFor
