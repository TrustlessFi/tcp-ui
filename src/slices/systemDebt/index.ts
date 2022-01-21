import { RootState } from '../../app/store'
import { getThunkDependencies, NonNull } from '../waitFor'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { sliceState, getStateWithValue, getGenericReducerBuilder } from '../'
import { unscale } from '../../utils'
import getContract from '../../utils/getContract'

import { Accounting } from '@trustlessfi/typechain';
import { ProtocolContract, contractsInfo } from '../contracts'
import { getLocalStorage } from '../../utils'

export type systemDebtInfo = {
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
      async (args: NonNull<typeof dependencies>) => {
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
  initialState: getStateWithValue<systemDebtInfo>(getLocalStorage(name, null)) as sliceState<systemDebtInfo>,
  reducers: {},
  extraReducers: (builder) => {
    builder = getGenericReducerBuilder(builder, getSystemDebtInfo.thunk)
  },
})

export default systemDebtSlice.reducer
