import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ChainID } from '../chainID'
import { sliceState, initialState, getGenericReducerBuilder } from '../'
import { unscale } from '../../utils'
import getContract from '../../utils/getContract'

import { Rates } from "../../utils/typechain/Rates"
import { ProtocolContract } from '../contracts/index';

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

export const ratesSlice = createSlice({
  name: 'rates',
  initialState: initialState as RatesState,
  reducers: {},
  extraReducers: (builder) => {
    builder = getGenericReducerBuilder(builder, getRatesInfo)
  },
});

export default ratesSlice.reducer;
