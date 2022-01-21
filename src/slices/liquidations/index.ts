import { RootState } from '../../app/store'
import { getThunkDependencies, NonNull } from '../waitFor'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { sliceState, getStateWithValue, getGenericReducerBuilder } from '../'
import getContract, { getMulticallContract } from '../../utils/getContract'

import { Liquidations } from '@trustlessfi/typechain'
import { ProtocolContract } from '../contracts'
import { getLocalStorage } from '../../utils'
import { executeMulticalls, oneContractManyFunctionMC, rc } from '@trustlessfi/multicall'

export type liquidationsInfo = {
  twapDuration: number,
  discoveryIncentive: number,
  liquidationIncentive: number,
}

const dependencies = getThunkDependencies(['contracts', 'trustlessMulticall'])

export const getLiquidationsInfo = {
  stateSelector: (state: RootState) => state.liquidations,
  dependencies,
  thunk:
    createAsyncThunk(
    'liquidations/getLiquidationsInfo',
    async (args: NonNull<typeof dependencies>): Promise<liquidationsInfo> => {
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
  initialState: getStateWithValue(getLocalStorage(name)) as sliceState<liquidationsInfo>,
  reducers: {},
  extraReducers: (builder) => {
    builder = getGenericReducerBuilder(builder, getLiquidationsInfo.thunk)
  },
});

export default liquidationsSlice.reducer
