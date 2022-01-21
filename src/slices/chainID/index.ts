import { PayloadAction } from '@reduxjs/toolkit'
import { ChainID, getAddress } from '@trustlessfi/addresses'
import { createLocalSlice } from '../'
import { RootState } from '../../app/store'

import localHardhatAddresses from '../../utils/localHardhatAddresses.json'

const initialState = {
  chainID: null as ChainID | null,
  unknownChainID: null as number | null,
  governor: null as string | null,
  trustlessMulticall: null as string | null,
  protocolDataAggregator: null as string | null,
  router: null as string | null
}

export type ChainIDState = typeof initialState

export const getChainIDFromState = (state: ChainIDState) =>
  state.chainID !== null ? state.chainID : state.unknownChainID

const partialChainIDSlice = createLocalSlice({
  name: 'chainID',
  initialState,
  reducers: {
    chainIDFound: (_state, action: PayloadAction<number>) => {
      const chainID = action.payload
      return ChainID[chainID] === undefined
        ? {
          chainID: null,
          unknownChainID: chainID,
          governor: null,
          trustlessMulticall: null,
          protocolDataAggregator: null,
          router: null,
        } : {
          chainID,
          unknownChainID: null,
          governor: getAddress(chainID, 'TCP', 'Governor', localHardhatAddresses),
          trustlessMulticall: getAddress(chainID, 'TrustlessMulticall', 'multicall', localHardhatAddresses),
          protocolDataAggregator: getAddress(chainID, 'TCP', 'ProtocolDataAggregator', localHardhatAddresses),
          router: getAddress(chainID, 'Uniswap', 'router', localHardhatAddresses),
        }
    },
  }
})

export const chainIDSlice = {
  ...partialChainIDSlice,
  stateSelector: (state: RootState) => state.chainID
}

export const { chainIDFound } = partialChainIDSlice.slice.actions

export default partialChainIDSlice.slice.reducer
