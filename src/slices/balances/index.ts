import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getProtocolContract, ProtocolContract } from '../../utils/protocolContracts'
import { ChainID } from '../chainID'
import { sliceState, initialState, getGenericReducerBuilder } from '../'
import { unscale } from '../../utils'

import { Liquidations } from "../../utils/typechain/Liquidations"

export type liquidationsInfo = {
  twapDuration: number,
  discoveryIncentive: number,
  liquidationIncentive: number,
}

export interface LiquidationsState extends sliceState {
  data: null | liquidationsInfo
}

export const getLiquidationsInfo = createAsyncThunk(
  'liquidations/getLiquidationsInfo',
  async (chainID: ChainID) => await fetchLiquidationsInfo(chainID)
)

export const fetchLiquidationsInfo = async (chainID: ChainID) => {
  if (chainID === null) return null

  const liquidations = await getProtocolContract(chainID, ProtocolContract.Liquidations) as Liquidations
  if (liquidations === null) return null

  let [
    twapDuration,
    discoveryIncentive,
    liquidationIncentive,
  ] = await Promise.all([
    liquidations.twapDuration(),
    liquidations.discoveryIncentive(),
    liquidations.liquidationIncentive(),
  ])

  return {
    twapDuration,
    discoveryIncentive: unscale(discoveryIncentive),
    liquidationIncentive: unscale(liquidationIncentive),
  }
}

export const liquidationsSlice = createSlice({
  name: 'liquidations',
  initialState: initialState as LiquidationsState,
  reducers: {},
  extraReducers: (builder) => {
    builder = getGenericReducerBuilder(builder, getLiquidationsInfo)
  },
});

export default liquidationsSlice.reducer;
