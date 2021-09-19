import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ChainID } from '../chainID'
import { sliceState, initialState, getGenericReducerBuilder } from '../'
import { unscale } from '../../utils'
import getContract from '../../utils/getContract'

import { Accounting } from "../../utils/typechain/Accounting";
import { ProtocolContract } from '../contracts/index';

export type systemDebtInfo = {
  debt: number
  totalTCPRewards: number
  cumulativeDebt: number
  debtExchangeRate: number
}

export type systemDebtArgs = {
  Accounting: string
}

export interface SystemDebtInfoState extends sliceState<systemDebtInfo> {}

export const getSystemDebtInfo = createAsyncThunk(
  'systemDebt/getSystemDebtInfo',
  async (args: systemDebtArgs) => {

    const accounting = getContract(args.Accounting, ProtocolContract.Accounting) as Accounting

    const sdi = await accounting.getSystemDebtInfo()
    return {
      debt: unscale(sdi.debt),
      totalTCPRewards: unscale(sdi.totalTCPRewards),
      cumulativeDebt: unscale(sdi.cumulativeDebt),
      debtExchangeRate: unscale(sdi.debtExchangeRate),
    }
  }
)

export const providerSlice = createSlice({
  name: 'systemDebt',
  initialState: initialState as SystemDebtInfoState,
  reducers: {},
  extraReducers: (builder) => {
    builder = getGenericReducerBuilder(builder, getSystemDebtInfo)
  },
});

export default providerSlice.reducer;
