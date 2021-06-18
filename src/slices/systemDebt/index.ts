import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getProtocolContract, ProtocolContract } from '../../utils/protocolContracts'
import { ProviderState } from '../provider'
import { BigNumber, ethers } from 'ethers';
import { sliceState, nullState } from '../'

import { Accounting } from "../../utils/typechain/Accounting";

export type systemDebtInfo = {
  debt: BigNumber;
  totalTCPRewards: BigNumber;
  cumulativeDebt: BigNumber;
  debtExchangeRate: BigNumber;
}

export interface SystemDebtInfoState extends sliceState {
  data: null | systemDebtInfo
}

export const getSystemDebtInfo = createAsyncThunk(
  'systemDebt/getSystemDebtInfo',
  async (provider: ProviderState) => await fetchSystemDebtInfo(provider)
)

export function fetchSystemDebtInfo(provider: ProviderState) {
  return new Promise<systemDebtInfo>(async () => {
    const accounting = await getProtocolContract(provider.chainID!, ProtocolContract.Accounting, provider.provider!) as Accounting
    return await accounting.getSystemDebtInfo()
  })
}

const initialState: SystemDebtInfoState = nullState

export const providerSlice = createSlice({
  name: 'systemDebt',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getSystemDebtInfo.pending, (state) => {
        state.loading = true
      })
      .addCase(getSystemDebtInfo.rejected, (state, action) => {
        state.loading = false
        state.error = action.error
      })
      .addCase(getSystemDebtInfo.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload
      });
  },
});

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`

// export const selectCount = (state: RootState) => state.counter.value;

export default providerSlice.reducer;
