import { RootState } from '../../app/store'
import { getThunkDependencies, NonNull, FetchNodes } from '../fetchNodes'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { sliceState, getStateWithValue, getGenericReducerBuilder } from '../'
import getContract, { getMulticallContract } from '../../utils/getContract'

import { Liquidations } from '@trustlessfi/typechain'
import ProtocolContract from '../contracts/ProtocolContract'
import { getLocalStorage } from '../../utils'
import { executeMulticalls, oneContractManyFunctionMC, rc } from '@trustlessfi/multicall'

const dependencies = getThunkDependencies(['contracts', 'trustlessMulticall'])

export const getLiquidationsInfo = {
  stateSelector: (state: RootState) => state.liquidations,
  dependencies,
  thunk:
    createAsyncThunk(
    'liquidations/getLiquidationsInfo',
    async (args: NonNull<typeof dependencies>) => {
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
  initialState: getStateWithValue(getLocalStorage(name)) as sliceState<FetchNodes['liquidationsInfo']>,
  reducers: {},
  extraReducers: (builder) => {
    builder = getGenericReducerBuilder(builder, getLiquidationsInfo.thunk)
  },
});

export default liquidationsSlice.reducer
