import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getProtocolContract, ProtocolContract } from '../../utils/protocolContracts'
import { ChainIDState } from '../chainID'
import { sliceState, initialState, getGenericReducerBuilder } from '../'
import { unscale } from '../../utils'

import { Accounting } from "../../utils/typechain/Accounting";

export type systemDebtInfo = {
  debt: number
  totalTCPRewards: number
  cumulativeDebt: number
  debtExchangeRate: number
}

export interface SystemDebtInfoState extends sliceState {
  data: null | systemDebtInfo
}

export const getSystemDebtInfo = createAsyncThunk(
  'systemDebt/getSystemDebtInfo',
  async (chainIDState: ChainIDState) => {
    const chainID = chainIDState.chainID
    if (chainID === null) return null

    const accounting = await getProtocolContract(chainID, ProtocolContract.Accounting) as Accounting
    if (accounting === null) return null

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
