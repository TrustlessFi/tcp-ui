import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getProtocolContract, ProtocolContract } from '../../utils/protocolContracts'
import { ProviderState } from '../provider'
import { BigNumber } from 'ethers';
import { sliceState, nullState } from '../'

import { Market } from "../../utils/typechain/Market"

export type marketInfo = {
  lastPeriodGlobalInterestAccrued: BigNumber,
  collateralizationRequirement: BigNumber,
  minPositionSize: BigNumber,
  twapDuration: BigNumber,
  interestPortionToLenders: BigNumber,
  periodLength: number,
  firstPeriod: number,
}

export interface MarketState extends sliceState {
  data: null | marketInfo
}

export const getMarketInfo = createAsyncThunk(
  'market/getMarketInfo',
  async (provider: ProviderState) => await fetchMarketInfo(provider)
)

export function fetchMarketInfo(provider: ProviderState) {
  return new Promise<marketInfo>(async () => {
    const market = await getProtocolContract(provider.chainID, ProtocolContract.Market, provider.provider!) as Market

    let [
      lastPeriodGlobalInterestAccrued,
      collateralizationRequirement,
      minPositionSize,
      twapDuration,
      interestPortionToLenders,
      periodLength,
      firstPeriod,
    ] = await Promise.all([
      market.lastPeriodGlobalInterestAccrued(),
      market.collateralizationRequirement(),
      market.minPositionSize(),
      market.twapDuration(),
      market.interestPortionToLenders(),
      market.periodLength(),
      market.firstPeriod(),
    ]);

    return {
      lastPeriodGlobalInterestAccrued,
      collateralizationRequirement,
      minPositionSize,
      twapDuration,
      interestPortionToLenders,
      periodLength: periodLength.toNumber(),
      firstPeriod: firstPeriod.toNumber(),
    }
  })
}

const initialState: MarketState = nullState

export const marketSlice = createSlice({
  name: 'systemDebt',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getMarketInfo.pending, (state) => {
        state.loading = true
      })
      .addCase(getMarketInfo.rejected, (state, action) => {
        state.loading = false
        state.error = action.error
      })
      .addCase(getMarketInfo.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload
      });
  },
});

export default marketSlice.reducer;
