import { RootState } from '../../app/store'
import { getThunkDependencies, NonNull } from '../waitFor'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { sliceState, getStateWithValue, getGenericReducerBuilder } from '../'
import getContract, { getMulticallContract } from '../../utils/getContract'

import { Rates } from '@trustlessfi/typechain/'
import { ProtocolContract } from '../contracts'
import { getLocalStorage } from '../../utils'
import { oneContractManyFunctionMC, rc, executeMulticalls } from '@trustlessfi/multicall'

export type ratesInfo = {
  positiveInterestRate: boolean,
  interestRateAbsoluteValue: number,
  referencePools: string[]
}

const dependencies = getThunkDependencies(['contracts', 'trustlessMulticall'])

export const getRatesInfo = {
  stateSelector: (state: RootState) => state.rates,
  dependencies,
  thunk:
    createAsyncThunk(
      'rates/getRatesInfo',
      async (args: NonNull<typeof dependencies>): Promise<ratesInfo> => {
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
  initialState: getStateWithValue(getLocalStorage(name)) as sliceState<ratesInfo>,
  reducers: {},
  extraReducers: (builder) => {
    builder = getGenericReducerBuilder(builder, getRatesInfo.thunk)
  },
});

export default ratesSlice.reducer;
