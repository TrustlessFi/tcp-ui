import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { sliceState, getState, getGenericReducerBuilder } from '../'
import getContract from '../../utils/getContract'
import { Market, TcpMulticallViewOnly } from "../../utils/typechain/"
import { ProtocolContract } from '../contracts'
import { getLocalStorage } from '../../utils/index'
import { executeMulticall, rc } from '../../utils/Multicall/index';
import { executeLend, executeWithdraw } from './api'
import { getGenericWriteReducerBuilder } from '../index';

export interface marketArgs {
  Market: string
  TcpMulticall: string
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
    const multicall = getContract(args.TcpMulticall, ProtocolContract.TcpMulticall, true) as unknown as TcpMulticallViewOnly

    console.log("before market execute multicall")
    const result = (await executeMulticall(
      multicall,
      market,
      {
        lastPeriodGlobalInterestAccrued: rc.BigNumberToNumber,
        collateralizationRequirement: rc.BigNumberUnscale,
        minPositionSize: rc.BigNumberUnscale,
        twapDuration: rc.Number,
        interestPortionToLenders: rc.BigNumberUnscale,
        periodLength: rc.BigNumberToNumber,
        firstPeriod: rc.BigNumberToNumber,
      },
    ))
    console.log("after market execute multicall", {result})

    return result
  }
)

export interface lendArgs {
  Market: string,
  amount: number,
}

export const lend = createAsyncThunk(
  'market/lend',
  async (data: lendArgs, {dispatch}) => await executeLend(dispatch, data),
)

export const withdraw = createAsyncThunk(
  'withdraw/lend',
  async (data: lendArgs, {dispatch}) => await executeWithdraw(dispatch, data),
)



const name = 'market'

export const marketSlice = createSlice({
  name,
  initialState: getState<marketInfo>(getLocalStorage(name, null)) as MarketState,
  reducers: {},
  extraReducers: (builder) => {
    builder = getGenericReducerBuilder(builder, getMarketInfo)
    builder = getGenericWriteReducerBuilder(builder, lend)
    builder = getGenericWriteReducerBuilder(builder, withdraw)
  },
})

export default marketSlice.reducer
