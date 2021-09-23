import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { sliceState, getState, getGenericReducerBuilder } from '../'
import getContract from '../../utils/getContract'

import {
  Liquidations,
  TcpMulticallViewOnly,
} from '../../utils/typechain'
import { ProtocolContract } from '../contracts/index'
import { getLocalStorage } from '../../utils/index'
import { executeMulticall } from '../../utils/Multicall/index'
import * as mc from '../../utils/Multicall'

export type liquidationsInfo = {
  twapDuration: number,
  discoveryIncentive: number,
  liquidationIncentive: number,
}

export type liquidationsArgs = {
  Liquidations: string,
  TcpMulticall: string,
}

export interface LiquidationsState extends sliceState<liquidationsInfo> {}

export const getLiquidationsInfo = createAsyncThunk(
  'liquidations/getLiquidationsInfo',

  async (args: liquidationsArgs): Promise<liquidationsInfo> => {
    const liquidations = getContract(args.Liquidations, ProtocolContract.Liquidations) as Liquidations
    const tcpMulticall = getContract(args.TcpMulticall, ProtocolContract.TcpMulticall, true) as unknown as TcpMulticallViewOnly

    return (await executeMulticall(
      tcpMulticall,
      liquidations,
      {
        twapDuration: mc.Number,
        discoveryIncentive: mc.BigNumberUnscale,
        liquidationIncentive: mc.BigNumberUnscale,
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
