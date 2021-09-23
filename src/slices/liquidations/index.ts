import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { sliceState, getState, getGenericReducerBuilder } from '../'
import getContract from '../../utils/getContract'

import { Liquidations } from "../../utils/typechain/Liquidations"
import { ProtocolContract } from '../contracts/index';
import { getLocalStorage } from '../../utils/index';
import { getMulticall, getDuplicateFuncMulticall, executeMulticalls } from '../../utils/Multicall/index';
import * as mc from '../../utils/Multicall'

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

  async (args: liquidationsArgs): Promise<liquidationsInfo> => {
    const liquidations = getContract(args.Liquidations, ProtocolContract.Liquidations) as Liquidations

    return (await executeMulticalls({
      info: getMulticall(liquidations,
        {
          twapDuration: mc.Number,
          discoveryIncentive: mc.BigNumberUnscale,
          liquidationIncentive: mc.BigNumberUnscale,
        },
      ),
    })).info
  }
)

const name = 'liquidations'

export const liquidationsSlice = createSlice({
  name,
  initialState: getState<liquidationsInfo>(getLocalStorage(name, null)) as LiquidationsState,
  reducers: {},
  extraReducers: (builder) => {
    builder = getGenericReducerBuilder(builder, getLiquidationsInfo)
  },
});

export default liquidationsSlice.reducer
