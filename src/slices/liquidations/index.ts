import { RootState } from '../../app/store'
import { getThunkDependencies } from '../fetchNodes'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getLocalStorageSliceState, getGenericReducerBuilder, NonNullValues } from '../'

import getContract, { getMulticallContract } from '../../utils/getContract'
import { Liquidations } from '@trustlessfi/typechain'
import ProtocolContract from '../contracts/ProtocolContract'
import { executeMulticalls, oneContractManyFunctionMC, rc } from '@trustlessfi/multicall'

export interface liquidationsInfo {
  twapDuration: number
  discoveryIncentive: number
  liquidationIncentive: number
}

const dependencies = getThunkDependencies(['contracts', 'trustlessMulticall'])

export const getLiquidationsInfo = {
  stateSelector: (state: RootState) => state.liquidations,
  dependencies,
  thunk:
    createAsyncThunk(
    'liquidations/getLiquidationsInfo',
    async (args: NonNullValues<typeof dependencies>): Promise<liquidationsInfo> => {
      const liquidations = getContract(args.contracts[ProtocolContract.Liquidations], ProtocolContract.Liquidations) as Liquidations
      const trustlessMulticall = getMulticallContract(args.trustlessMulticall)

      const { liquidationsInfo } = await executeMulticalls(
        trustlessMulticall,
        {
          liquidationsInfo: oneContractManyFunctionMC(
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
}

const name = 'liquidations'

export const liquidationsSlice = createSlice({
  name,
  initialState: getLocalStorageSliceState<liquidationsInfo>(name),
  reducers: {},
  extraReducers: (builder) => {
    builder = getGenericReducerBuilder(builder, getLiquidationsInfo.thunk)
  },
});

export default liquidationsSlice.reducer
