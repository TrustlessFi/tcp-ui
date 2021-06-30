  import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
  import { getProtocolContract, ProtocolContract } from '../../utils/protocolContracts'
  import { ChainID } from '../chainID'
  import { sliceState, initialState, getGenericReducerBuilder } from '../'
  import { unscale } from '../../utils'

  import { Market } from "../../utils/typechain/Market"


  export interface marketArgs {
    chainID: ChainID,
  }

  export type marketInfo = {
    lastPeriodGlobalInterestAccrued: number,
    collateralizationRequirement: number,
    minPositionSize: number,
    twapDuration: number,
    interestPortionToLenders: number,
    periodLength: number,
    firstPeriod: number,
  }

  export interface MarketState extends sliceState<marketInfo> {}

  export const getMarketInfo = createAsyncThunk(
    'market/getMarketInfo',
    async (args: marketArgs) => {
      const market = await getProtocolContract(args.chainID, ProtocolContract.Market) as Market
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
  )

  export const marketSlice = createSlice({
    name: 'systemDebt',
    initialState: initialState as MarketState,
    reducers: {},
    extraReducers: (builder) => {
      builder = getGenericReducerBuilder(builder, getMarketInfo)
    },
  });

  export default marketSlice.reducer;
