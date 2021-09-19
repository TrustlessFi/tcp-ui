import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { sliceState, initialState, getGenericReducerBuilder } from '../'
import { unscale } from '../../utils'
import getContract from '../../utils/getContract'
import { Market } from "../../utils/typechain/Market"
import { ProtocolContract } from '../contracts'


  export interface marketArgs {
    Market: string
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
      console.log("getMarketInfo", args)
      const market = getContract(args.Market, ProtocolContract.Market) as Market

      const [
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
      ])

      const marketInfo = {
        lastPeriodGlobalInterestAccrued: lastPeriodGlobalInterestAccrued.toNumber(),
        collateralizationRequirement: unscale(collateralizationRequirement),
        minPositionSize: unscale(minPositionSize),
        twapDuration,
        interestPortionToLenders: unscale(interestPortionToLenders),
        periodLength: periodLength.toNumber(),
        firstPeriod: firstPeriod.toNumber(),
      }
      console.log({marketInfo})
      return marketInfo
    }
  )

  export const marketSlice = createSlice({
    name: 'systemDebt',
    initialState: initialState as MarketState,
    reducers: {},
    extraReducers: (builder) => {
      builder = getGenericReducerBuilder(builder, getMarketInfo)
    },
  })

  export default marketSlice.reducer
