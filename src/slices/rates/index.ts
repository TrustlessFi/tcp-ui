import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getProtocolContract, ProtocolContract } from '../../utils/protocolContracts'
import { ChainID } from '../chainID'
import { sliceState, initialState, getGenericReducerBuilder } from '../'
import { unscale } from '../../utils'

import { Rates } from "../../utils/typechain/Rates"

export type ratesInfo = {
  positiveInterestRate: boolean,
  interestRateAbsoluteValue: number,
}

export interface RatesState extends sliceState {
  data: null | ratesInfo
}

export const getRatesInfo = createAsyncThunk(
  'rates/getRatesInfo',
  async (chainID: ChainID): Promise<null | ratesInfo> => {
    if (chainID === null) return null

    const rates = await getProtocolContract(chainID, ProtocolContract.Rates) as Rates
    if (rates === null) return null

    let [
      positiveInterestRate,
      interestRateAbsoluteValue,
    ] = await Promise.all([
      rates.positiveInterestRate(),
      rates.interestRateAbsoluteValue(),
    ])

    return {
      positiveInterestRate,
      interestRateAbsoluteValue: unscale(interestRateAbsoluteValue),
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
