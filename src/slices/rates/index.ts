import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { sliceState, getState, getGenericReducerBuilder } from '../'
import { unscale } from '../../utils'
import getContract from '../../utils/getContract'

import { Rates } from "../../utils/typechain/Rates"
import { ProtocolContract } from '../contracts/index';
import { getLocalStorage } from '../../utils/index';

export type ratesInfo = {
  positiveInterestRate: boolean,
  interestRateAbsoluteValue: number,
  referencePools: string[]

}

export type ratesArgs = {
  Rates: string
}

export interface RatesState extends sliceState<ratesInfo> {}

export const getRatesInfo = createAsyncThunk(
  'rates/getRatesInfo',
  async (args: ratesArgs): Promise<null | ratesInfo> => {
    const rates = getContract(args.Rates, ProtocolContract.Rates) as Rates

    const [
      positiveInterestRate,
      interestRateAbsoluteValue,
      referencePools
    ] = await Promise.all([
      rates.positiveInterestRate(),
      rates.interestRateAbsoluteValue(),
      rates.getReferencePools(),
    ])

    return {
      positiveInterestRate,
      interestRateAbsoluteValue: unscale(interestRateAbsoluteValue),
      referencePools
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
