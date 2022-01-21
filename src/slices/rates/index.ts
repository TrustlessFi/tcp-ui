import { RootState } from '../../app/store'
import { getThunkDependencies } from '../fetchNodes'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getLocalStorageSliceState, getGenericReducerBuilder, NonNullValues } from '../'

import getContract, { getMulticallContract } from '../../utils/getContract'
import { Rates } from '@trustlessfi/typechain/'
import ProtocolContract from '../contracts/ProtocolContract'
import { oneContractManyFunctionMC, rc, executeMulticalls } from '@trustlessfi/multicall'

const dependencies = getThunkDependencies(['contracts', 'trustlessMulticall'])

export interface ratesInfo {
  positiveInterestRate: boolean
  interestRateAbsoluteValue: number
  referencePools: string[]
}

export const getRatesInfo = {
  stateSelector: (state: RootState) => state.rates,
  dependencies,
  thunk:
    createAsyncThunk(
      'rates/getRatesInfo',
      async (args: NonNullValues<typeof dependencies>): Promise<ratesInfo> => {
        const rates = getContract(args.contracts[ProtocolContract.Rates], ProtocolContract.Rates) as Rates
        const trustlessMulticall = getMulticallContract(args.trustlessMulticall)

        const { ratesInfo } = await executeMulticalls(
          trustlessMulticall,
          {
            ratesInfo: oneContractManyFunctionMC(
              rates,
              {
                positiveInterestRate: rc.Boolean,
                interestRateAbsoluteValue: rc.BigNumberUnscale,
                getReferencePools: rc.StringArray,
              },
            )
          }
        )

        return {
          positiveInterestRate: ratesInfo.positiveInterestRate,
          interestRateAbsoluteValue: ratesInfo.interestRateAbsoluteValue,
          referencePools: ratesInfo.getReferencePools,
        }
      }
    )
}

const name = 'rates'

export const ratesSlice = createSlice({
  name,
  initialState: getLocalStorageSliceState<ratesInfo>(name),
  reducers: {},
  extraReducers: (builder) => {
    builder = getGenericReducerBuilder(builder, getRatesInfo.thunk)
  },
});

export default ratesSlice.reducer;
