import { RootState } from '../../app/store'
import { getThunkDependencies } from '../fetchNodes'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getLocalStorageSliceState, getGenericReducerBuilder, NonNullValues } from '../'

import getContract, { getMulticallContract } from '../../utils/getContract'
import { Prices } from '@trustlessfi/typechain'
import ProtocolContract from '../contracts/ProtocolContract'
import { oneContractManyFunctionMC, rc, executeMulticalls } from '@trustlessfi/multicall'

export interface pricesInfo { ethPrice: number }

export const dependencies = getThunkDependencies(['contracts', 'trustlessMulticall', 'liquidationsInfo'])

export const getPricesInfo = {
  stateSelector: (state: RootState) => state.prices,
  dependencies,
  thunk:
    createAsyncThunk(
      'prices/getPricesInfo',
      async (args: NonNullValues<typeof dependencies>): Promise<pricesInfo> => {
        const prices = getContract(args.contracts[ProtocolContract.Prices], ProtocolContract.Prices) as Prices
        const trustlessMulticall = getMulticallContract(args.trustlessMulticall)

        const { ethPrice } = await executeMulticalls(
          trustlessMulticall,
          {
            ethPrice: oneContractManyFunctionMC(
              prices,
              { calculateInstantCollateralPrice: rc.BigNumberUnscale },
              { calculateInstantCollateralPrice: [args.liquidationsInfo.twapDuration] },
            ),
          }
        )

        return { ethPrice: ethPrice.calculateInstantCollateralPrice }
      }
    )
}

const name = 'prices'

export const pricesSlice = createSlice({
  name,
  initialState: getLocalStorageSliceState<pricesInfo>(name),
  reducers: {},
  extraReducers: (builder) => {
    builder = getGenericReducerBuilder(builder, getPricesInfo.thunk)
  },
});

export default pricesSlice.reducer
