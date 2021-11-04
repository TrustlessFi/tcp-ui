import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { sliceState, getStateWithValue, getGenericReducerBuilder } from '../'
import getContract, { getMulticallContract } from '../../utils/getContract'

import { Liquidations } from '@trustlessfi/typechain'
import { ProtocolContract } from '../contracts'
import { getLocalStorage } from '../../utils'
import { executeMulticalls, getMulticall, rc } from '@trustlessfi/multicall'

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
    const trustlessMulticall = getMulticallContract(args.TrustlessMulticall)

    const { liquidationsInfo } = await executeMulticalls(
      trustlessMulticall,
      {
        liquidationsInfo: getMulticall(
          liquidations,
          {
            twapDuration: rc.Number,
            discoveryIncentive: rc.BigNumberUnscale,
            liquidationIncentive: rc.BigNumberUnscale,
          },
        ),
      }
    )

    return liquidationsInfo
  }
)

const name = 'liquidations'

export const liquidationsSlice = createSlice({
  name,
  initialState: getStateWithValue<liquidationsInfo>(getLocalStorage(name, null)) as LiquidationsState,
  reducers: {},
  extraReducers: (builder) => {
    builder = getGenericReducerBuilder(builder, getLiquidationsInfo)
  },
});

export default liquidationsSlice.reducer
