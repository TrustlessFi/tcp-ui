import { PayloadAction } from '@reduxjs/toolkit'
import { ChainID, getAddress } from '@trustlessfi/addresses'
import { createLocalSlice, CacheDuration } from '../'
import { RootState } from '../fetchNodes'

import localHardhatAddresses from '../../utils/localHardhatAddresses.json'

export interface rootContracts {
  governor: string
  trustlessMulticall: string
  protocolDataAggregator: string
  router: string
}

const rootContractsSlice = createLocalSlice({
  name: 'rootContracts',
  initialState: null as null | rootContracts,
  stateSelector: (state: RootState) => state.rootContracts,
  cacheDuration: CacheDuration.NONE,
  reducers: {
    chainIDFoundForRootContracts: (_state, action: PayloadAction<ChainID>) => {
      const chainID = action.payload
      try {
        return {
          governor: getAddress(chainID, 'TCP', 'Governor', localHardhatAddresses),
          trustlessMulticall: getAddress(chainID, 'TrustlessMulticall', 'multicall', localHardhatAddresses),
          protocolDataAggregator: getAddress(chainID, 'TCP', 'ProtocolDataAggregator', localHardhatAddresses),
          router: getAddress(chainID, 'Uniswap', 'router', localHardhatAddresses),
        }
      } catch(e) {
        return null
      }
    },
  }
})

export const { chainIDFoundForRootContracts } = rootContractsSlice.slice.actions

export default rootContractsSlice
