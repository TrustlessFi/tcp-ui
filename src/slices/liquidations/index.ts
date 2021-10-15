import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { sliceState, getState, getGenericReducerBuilder } from '../'
import getContract from '../../utils/getContract'

import {
  Liquidations,
  TrustlessMulticallViewOnly,
} from '../../utils/typechain'
import { ProtocolContract } from '../contracts'
import { getLocalStorage } from '../../utils'
import { executeMulticall, rc } from '@trustlessfi/multicall'

export type liquidationsInfo = {
  twapDuration: number,
  discoveryIncentive: number,
  liquidationIncentive: number,
}

export type liquidationsArgs = {
  Liquidations: string,
  TrustlessMulticall: string,
}

export interface LiquidationsState extends sliceState<liquidationsInfo> {}

export const getLiquidationsInfo = createAsyncThunk(
  'liquidations/getLiquidationsInfo',

  async (args: liquidationsArgs): Promise<liquidationsInfo> => {
    const liquidations = getContract(args.Liquidations, ProtocolContract.Liquidations) as Liquidations
    const trustlessMulticall = getContract(args.TrustlessMulticall, ProtocolContract.TrustlessMulticall, true) as unknown as TrustlessMulticallViewOnly

    return (await executeMulticall(
      trustlessMulticall,
      liquidations,
      {
        twapDuration: rc.Number,
        discoveryIncentive: rc.BigNumberUnscale,
        liquidationIncentive: rc.BigNumberUnscale,
      },
    ))
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
