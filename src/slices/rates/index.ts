import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getProtocolContract, ProtocolContract } from '../../utils/protocolContracts'
import { ChainID } from '../chainID'
import { sliceState, initialState, getGenericReducerBuilder } from '../'
import { unscale } from '../../utils'

import { Rates } from "../../utils/typechain/Rates"

export type ratesInfo = {
  positiveInterestRate: boolean,
  interestRateAbsoluteValue: number,
  referencePools: string[]

}

export type ratesArgs = {
  chainID: ChainID
}

export interface RatesState extends sliceState<ratesInfo> {}

export const getRatesInfo = createAsyncThunk(
  'rates/getRatesInfo',
  async (args: ratesArgs): Promise<null | ratesInfo> => {
    const rates = await getProtocolContract(args.chainID, ProtocolContract.Rates) as Rates
    if (rates === null) return null

    let [
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
