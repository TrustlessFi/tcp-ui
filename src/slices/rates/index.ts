import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { sliceState, getStateWithValue, getGenericReducerBuilder } from '../'
import getContract, { getMulticallContract } from '../../utils/getContract'

import { Rates } from '@trustlessfi/typechain/'
import { ProtocolContract, ContractsInfo } from '../contracts'
import { getLocalStorage } from '../../utils'
import { executeMulticall, rc } from '@trustlessfi/multicall'

export type ratesInfo = {
  positiveInterestRate: boolean,
  interestRateAbsoluteValue: number,
  referencePools: string[]
}

export type ratesArgs = {
  contracts: ContractsInfo
  trustlessMulticall: string
}

export interface RatesState extends sliceState<ratesInfo> {}

export const getRatesInfo = createAsyncThunk(
  'rates/getRatesInfo',
  async (args: ratesArgs): Promise<ratesInfo> => {
    const rates = getContract(args.contracts[ProtocolContract.Rates], ProtocolContract.Rates) as Rates
    const trustlessMulticall = getMulticallContract(args.trustlessMulticall)

    const result = (await executeMulticall(
      trustlessMulticall,
      rates,
      {
        positiveInterestRate: rc.Boolean,
        interestRateAbsoluteValue: rc.BigNumberUnscale,
        getReferencePools: rc.StringArray,
      },
    ))

    return {
      positiveInterestRate: result.positiveInterestRate,
      interestRateAbsoluteValue: result.interestRateAbsoluteValue,
      referencePools: result.getReferencePools,
    }
  }
)

const name = 'rates'

export const ratesSlice = createSlice({
  name,
  initialState: getStateWithValue<ratesInfo>(getLocalStorage(name, null)) as   RatesState,
  reducers: {},
  extraReducers: (builder) => {
    builder = getGenericReducerBuilder(builder, getRatesInfo)
  },
});

export default ratesSlice.reducer;
