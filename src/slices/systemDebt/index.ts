import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { sliceState, getState, getGenericReducerBuilder } from '../'
import { unscale } from '../../utils'
import getContract from '../../utils/getContract'

import { Accounting } from "../../utils/typechain/Accounting";
import { ProtocolContract } from '../contracts/index';
import { getLocalStorage } from '../../utils/index';

export type systemDebtInfo = {
  debt: number
  totalTCPRewards: number
  cumulativeDebt: number
  debtExchangeRate: number
}

export type systemDebtArgs = {
  Accounting: string
}

export interface SystemDebtState extends sliceState<systemDebtInfo> {}

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

const name = 'systemDebt'

export const systemDebtSlice = createSlice({
  name,
  initialState: getState<systemDebtInfo>(getLocalStorage(name, null)) as SystemDebtState,
  reducers: {},
  extraReducers: (builder) => {
    builder = getGenericReducerBuilder(builder, getSystemDebtInfo)
  },
})

export default systemDebtSlice.reducer
