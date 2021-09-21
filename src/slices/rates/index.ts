import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { sliceState, getState, getGenericReducerBuilder } from '../'
import getContract from '../../utils/getContract'
import * as mc from '../../utils/Multicall'

import { Rates } from "../../utils/typechain/Rates"
import { ProtocolContract } from '../contracts/index';
import { getLocalStorage } from '../../utils/index';
import Multicall from '../../utils/Multicall/index';

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
  async (args: ratesArgs): Promise<ratesInfo> => {
    const rates = getContract(args.Rates, ProtocolContract.Rates) as Rates

    const result = await Multicall(rates).execute({
      positiveInterestRate: mc.Boolean,
      interestRateAbsoluteValue: mc.BigNumberUnscale,
      getReferencePools: mc.StringArray,
    })

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
