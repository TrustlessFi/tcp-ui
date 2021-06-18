import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getProtocolContract, ProtocolContract } from '../../utils/protocolContracts'
import { ChainIDState } from '../chainID'
import { sliceState, nullState, getGenericReducerBuilder } from '../'
import { unscale } from '../../utils'

import { Market } from "../../utils/typechain/Market"

export type marketInfo = {
  lastPeriodGlobalInterestAccrued: number,
  collateralizationRequirement: number,
  minPositionSize: number,
  twapDuration: number,
  interestPortionToLenders: number,
  periodLength: number,
  firstPeriod: number,
}

export interface MarketState extends sliceState {
  data: null | marketInfo
}

export const getMarketInfo = createAsyncThunk(
  'market/getMarketInfo',
  async (chainIDState: ChainIDState) => await fetchMarketInfo(chainIDState)
)

export const fetchMarketInfo = async (chainIDState: ChainIDState) => {
  const chainID = chainIDState.chainID
  if (chainID === null) return null

  const market = await getProtocolContract(chainID, ProtocolContract.Market) as Market
  if (market === null) return null

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
    lastPeriodGlobalInterestAccrued: lastPeriodGlobalInterestAccrued.toNumber(),
    collateralizationRequirement: unscale(collateralizationRequirement),
    minPositionSize: unscale(minPositionSize),
    twapDuration,
    interestPortionToLenders: unscale(interestPortionToLenders),
    periodLength: periodLength.toNumber(),
    firstPeriod: firstPeriod.toNumber(),
  }
}

const initialState: MarketState = nullState

export const marketSlice = createSlice({
  name: 'systemDebt',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder = getGenericReducerBuilder(builder, getMarketInfo)
  },
});

export default marketSlice.reducer;
