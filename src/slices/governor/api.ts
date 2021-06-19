import { SystemDebtInfoState } from '../systemDebt'
import { ChainIDState } from '../chainID'
import { MarketState } from "../market"
import { getGovernorInfo } from './'
import { AppDispatch, store } from '../../app/store'
import { AppSelector } from '../../app/hooks'
import { governorInfo } from './'


export interface fetchPositionsArgs {
  dispatch: AppDispatch,
  chainIDState: ChainIDState,
  userAddress: string | null,
  sdi: SystemDebtInfoState,
  marketInfo: MarketState,
}

export const waitForGovernor = (selector: AppSelector, dispatch: AppDispatch): governorInfo | null => {
  const governorData = selector(state => state.governor.data)
  const chainIDState = selector(state => state.chainID)

  // cant subscribe to loading or else we would get an infinite loop
  if (governorData === null && !store.getState().governor.loading) {
    dispatch(getGovernorInfo(chainIDState))
  }
  return governorData
}
