import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { sliceState, getState, getGenericReducerBuilder } from '../'
import getContract from '../../utils/getContract'

import { Rates, TrustlessMulticallViewOnly } from "../../utils/typechain/"
import { ProtocolContract } from '../contracts'
import { getLocalStorage } from '../../utils'
import { executeMulticall, rc } from '../../utils/Multicall'

export type ratesInfo = {
  positiveInterestRate: boolean,
  interestRateAbsoluteValue: number,
  referencePools: string[]
}

export type ratesArgs = {
  Rates: string
  TrustlessMulticall: string
}

export interface RatesState extends sliceState<ratesInfo> {}

export const getRatesInfo = createAsyncThunk(
  'rates/getRatesInfo',
  async (args: ratesArgs): Promise<ratesInfo> => {
    const rates = getContract(args.Rates, ProtocolContract.Rates) as Rates
    const multicall = getContract(args.TrustlessMulticall, ProtocolContract.TrustlessMulticall, true) as unknown as TrustlessMulticallViewOnly

    const result = (await executeMulticall(
      multicall,
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
  initialState: getState<ratesInfo>(getLocalStorage(name, null)) as RatesState,
  reducers: {},
  extraReducers: (builder) => {
    builder = getGenericReducerBuilder(builder, getRatesInfo)
  },
});

export default ratesSlice.reducer;
