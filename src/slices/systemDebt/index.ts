import { RootState } from '../../app/store'
import { getThunkDependencies } from '../fetchNodes'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getLocalStorageSliceState, getLocalStorageState, getGenericReducerBuilder, NonNullValues } from '../'

import { unscale } from '../../utils'
import getContract from '../../utils/getContract'

import { Accounting } from '@trustlessfi/typechain';
import ProtocolContract from '../contracts/ProtocolContract'

export interface sdi {
  debt: number
  totalTCPRewards: number
  cumulativeDebt: number
  debtExchangeRate: number
}

const dependencies = getThunkDependencies(['contracts'])

export const getSystemDebtInfo = {
  stateSelector: (state: RootState) => state.systemDebt,
  dependencies,
  thunk:
    createAsyncThunk(
      'systemDebt/getSystemDebtInfo',
      async (args: NonNullValues<typeof dependencies>): Promise<sdi> => {
        const accounting = getContract(args.contracts[ProtocolContract.Accounting], ProtocolContract.Accounting) as Accounting

        const sdi = await accounting.getSystemDebtInfo()

        return {
          debt: unscale(sdi.debt),
          totalTCPRewards: unscale(sdi.totalTCPRewards),
          cumulativeDebt: unscale(sdi.cumulativeDebt),
          debtExchangeRate: unscale(sdi.debtExchangeRate),
        }
      }
    )
}

const name = 'systemDebt'

export const systemDebtSlice = createSlice({
  name,
  initialState: getLocalStorageSliceState<sdi>(name),
  reducers: {},
  extraReducers: (builder) => {
    builder = getGenericReducerBuilder(builder, getSystemDebtInfo.thunk)
  },
})

export default systemDebtSlice.reducer
