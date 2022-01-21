import { AsyncThunk } from '@reduxjs/toolkit'
import { AppDispatch, store, RootState } from '../app/store'
import { AppSelector } from '../app/hooks'
import { getGovernorInfo } from './governor'
import { getMarketInfo } from './market'
import { getRatesInfo } from './rates'
import { getPoolsMetadata } from './poolsMetadata'
import { getPoolsCurrentData } from './poolsCurrentData'
import { getLiquidityPositions } from './liquidityPositions'
import { getPositions } from './positions'
import { getSystemDebtInfo } from './systemDebt'
import { getLiquidationsInfo } from './liquidations'
import { getRewardsInfo } from './rewards'
import { getPricesInfo } from './prices'
import { getBalances } from './balances'
import { getContracts } from './contracts'
import { getCurrentChainInfo } from './currentChainInfo'

import { sliceState, NonNullValues } from './'
import { FetchNode, FetchNodes } from './fetchNodes'

const getWaitFunction = <
    Value,
    Dependencies extends Partial<{[fetchNode in keyof FetchNodes]: FetchNodes[fetchNode] | null}>,
  >(waitForData: {
    stateSelector: (state: RootState) => sliceState<Value>
    dependencies: Dependencies
    thunk: AsyncThunk<Value, NonNullValues<Dependencies>, {}>
  }) => (selector: AppSelector, dispatch: AppDispatch) => {

    const { stateSelector, thunk, dependencies} = waitForData
    const state = selector(stateSelector)

    const inputArgs = Object.fromEntries(Object.keys(dependencies).map(fetchNode =>
      [fetchNode, (() => waitForImpl)()[fetchNode as FetchNode](selector, dispatch)]
    )) as Dependencies

    if (Object.values(inputArgs).includes(null)) return null

    if (state.error !== null) {
      console.error(state.error.message)
      throw state.error
    }

    if (state.value === null && !stateSelector(store.getState()).loading) {
      dispatch(thunk(inputArgs as NonNullValues<Dependencies>))
    }

    return state.value
  }

const getStateSelector = <T>(selectorFunc: (state: RootState) => T) =>
  (selector: AppSelector, _dispatch: AppDispatch) => selector(selectorFunc)

const waitForImpl: {[key in FetchNode]: (selector: AppSelector, _dispatch: AppDispatch) => FetchNodes[key] | null} = {
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
