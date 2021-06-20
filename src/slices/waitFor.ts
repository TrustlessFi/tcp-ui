import { AppDispatch, store } from './../app/store'
import { AppSelector } from './../app/hooks'
import { governorInfo, getGovernorInfo } from './governor'
import { marketInfo, getMarketInfo } from './market'
import { ratesInfo, getRatesInfo } from './rates'
import { PositionMap, getPositions } from './positions'
import { getSystemDebtInfo, systemDebtInfo } from './systemDebt'
import { liquidationsInfo, getLiquidationsInfo } from './liquidations'

import { getPricesInfo, pricesInfo } from './prices/index'

export const waitForPrices = (selector: AppSelector, dispatch: AppDispatch): pricesInfo | null => {
  const chainID = selector(state => state.chainID.chainID)

  const governorInfo = waitForGovernor(selector, dispatch)
  const liquidationsInfo = waitForLiquidations(selector, dispatch)
  const pricesData = selector(state => state.prices.data)

  if (chainID === null) return null
  if (governorInfo === null || liquidationsInfo === null) return null

  if (pricesData === null && !store.getState().prices.loading) {
    dispatch(getPricesInfo({chainID, governorInfo, liquidationsInfo}))
  }
  return pricesData
}

export const waitForGovernor = (selector: AppSelector, dispatch: AppDispatch): governorInfo | null => {
  const chainID = selector(state => state.chainID.chainID)
  const governorData = selector(state => state.governor.data)

  if (chainID === null) return null

  if (governorData === null && !store.getState().governor.loading) {
    dispatch(getGovernorInfo(chainID))
  }
  return governorData
}

export const waitForMarket = (selector: AppSelector, dispatch: AppDispatch): marketInfo | null => {
  const chainID = selector(state => state.chainID.chainID)
  const marketData = selector(state => state.market.data)
  if (chainID === null) return null

  if (marketData === null && !store.getState().market.loading) {
    dispatch(getMarketInfo(chainID))
  }
  return marketData
}

export const waitForLiquidations = (selector: AppSelector, dispatch: AppDispatch): liquidationsInfo | null => {
  const chainID = selector(state => state.chainID.chainID)
  const liquidationsData = selector(state => state.liquidations.data)
  if (chainID === null) return null

  if (liquidationsData === null && !store.getState().liquidations.loading) {
    dispatch(getLiquidationsInfo(chainID))
  }
  return liquidationsData
}

export const waitForRates = (selector: AppSelector, dispatch: AppDispatch): ratesInfo | null => {
  const chainID = selector(state => state.chainID.chainID)
  const ratesData = selector(state => state.rates.data)
  if (chainID === null) return null

  if (ratesData === null && !store.getState().rates.loading) {
    dispatch(getRatesInfo(chainID))
  }
  return ratesData
}

export const waitForSDI = (selector: AppSelector, dispatch: AppDispatch): systemDebtInfo | null => {
  const chainID = selector(state => state.chainID.chainID)
  const sdi = selector(state => state.systemDebt.data)
  if (chainID === null) return null

  if (sdi === null && !store.getState().systemDebt.loading) {
    dispatch(getSystemDebtInfo(chainID))
  }
  return sdi
}

export const waitForPositions = (selector: AppSelector, dispatch: AppDispatch): PositionMap | null => {
  const chainID = selector(state => state.chainID.chainID)
  const userAddress = selector(state => state.wallet.address)

  const sdi = waitForSDI(selector, dispatch)
  const marketInfo = waitForMarket(selector, dispatch)
  const positions = selector(state => state.positions.data)

  if (chainID === null || userAddress === null) return null
  if (sdi === null || marketInfo === null) return null

  if (positions === null && !store.getState().positions.loading) {
    dispatch(getPositions({chainID, userAddress, sdi, marketInfo }))
  }
  return positions
}
