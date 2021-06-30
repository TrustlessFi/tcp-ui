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

export type liquidationsArgs = {
  chainID: ChainID,
}

export interface LiquidationsState extends sliceState<liquidationsInfo> {}

export const getLiquidationsInfo = createAsyncThunk(
  'liquidations/getLiquidationsInfo',

  async (args: liquidationsArgs) => {
    const liquidations = await getProtocolContract(args.chainID, ProtocolContract.Liquidations) as Liquidations
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
)

export const liquidationsSlice = createSlice({
  name: 'liquidations',
  initialState: initialState as LiquidationsState,
  reducers: {},
  extraReducers: (builder) => {
    builder = getGenericReducerBuilder(builder, getLiquidationsInfo)
  },
});

export default liquidationsSlice.reducer;
