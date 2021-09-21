import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { sliceState, getState, getGenericReducerBuilder } from '../'
import getContract from '../../utils/getContract'
import { Market } from "../../utils/typechain/Market"
import { ProtocolContract } from '../contracts'
import { getLocalStorage } from '../../utils/index'
import Multicall from '../../utils/Multicall'
import * as mc from '../../utils/Multicall'

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
  async (args: marketArgs): Promise<marketInfo> => {
    const market = getContract(args.Market, ProtocolContract.Market) as Market

    return Multicall(market).execute({
      lastPeriodGlobalInterestAccrued: mc.BigNumberToNumber,
      collateralizationRequirement: mc.BigNumberUnscale,
      minPositionSize: mc.BigNumberUnscale,
      twapDuration: mc.Number,
      interestPortionToLenders: mc.BigNumberUnscale,
      periodLength: mc.BigNumberToNumber,
      firstPeriod: mc.BigNumberToNumber,
    })
  }
)

const name = 'market'

export const marketSlice = createSlice({
  name,
  initialState: getState<marketInfo>(getLocalStorage(name, null)) as MarketState,
  reducers: {},
  extraReducers: (builder) => {
    builder = getGenericReducerBuilder(builder, getMarketInfo)
  },
})

export default marketSlice.reducer
