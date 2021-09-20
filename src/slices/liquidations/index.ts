import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ChainID } from '../chainID'
import { sliceState, initialState, getGenericReducerBuilder } from '../'
import { unscale } from '../../utils'
import getContract from '../../utils/getContract'

import { Liquidations } from "../../utils/typechain/Liquidations"
import { ProtocolContract } from '../contracts/index';
import { getLocalStorage } from '../../utils/index';

export type liquidationsInfo = {
  twapDuration: number,
  discoveryIncentive: number,
  liquidationIncentive: number,
}

export type liquidationsArgs = {
  Liquidations: string,
}

export interface LiquidationsState extends sliceState<liquidationsInfo> {}

export const getLiquidationsInfo = createAsyncThunk(
  'liquidations/getLiquidationsInfo',

  async (args: liquidationsArgs) => {
    const liquidations = getContract(args.Liquidations, ProtocolContract.Liquidations) as Liquidations

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

const name = 'liquidations'

export const liquidationsSlice = createSlice({
  name,
  initialState: getLocalStorage(name, initialState) as LiquidationsState,
  reducers: {},
  extraReducers: (builder) => {
    builder = getGenericReducerBuilder(builder, getLiquidationsInfo)
  },
});

export default liquidationsSlice.reducer;
