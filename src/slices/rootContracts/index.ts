import { PayloadAction } from '@reduxjs/toolkit'
import { ChainID, getAddress } from '@trustlessfi/addresses'
import { createLocalSlice } from '../'
import { RootState } from '../../app/store'

import localHardhatAddresses from '../../utils/localHardhatAddresses.json'

export interface rootContracts {
  governor: string
  trustlessMulticall: string
  protocolDataAggregator: string
  router: string
}

const initialState = null as null | rootContracts

const partialRootContractsSlice = createLocalSlice({
  name: 'rootContracts',
  initialState,
  reducers: {
    chainIDFoundForRootContracts: (_state, action: PayloadAction<ChainID>) => {
      const chainID = action.payload
      return {
        governor: getAddress(chainID, 'TCP', 'Governor', localHardhatAddresses),
        trustlessMulticall: getAddress(chainID, 'TrustlessMulticall', 'multicall', localHardhatAddresses),
        protocolDataAggregator: getAddress(chainID, 'TCP', 'ProtocolDataAggregator', localHardhatAddresses),
        router: getAddress(chainID, 'Uniswap', 'router', localHardhatAddresses),
      }
    },
  }
})

export const rootContractsSlice = {
  ...partialRootContractsSlice,
  stateSelector: (state: RootState) => state.rootContracts
}

export const { chainIDFoundForRootContracts } = partialRootContractsSlice.slice.actions

export default partialRootContractsSlice.slice.reducer
