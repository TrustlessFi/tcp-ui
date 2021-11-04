import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { sliceState, getStateWithValue, getGenericReducerBuilder } from '../'
import { unscale } from '../../utils'
import getContract from '../../utils/getContract'

import { Accounting } from '@trustlessfi/typechain';
import { ProtocolContract } from '../contracts'
import { getLocalStorage } from '../../utils'

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
  initialState: getStateWithValue<systemDebtInfo>(getLocalStorage(name, null)) as SystemDebtState,
  reducers: {},
  extraReducers: (builder) => {
    builder = getGenericReducerBuilder(builder, getSystemDebtInfo)
  },
})

export default systemDebtSlice.reducer
