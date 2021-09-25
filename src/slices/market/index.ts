import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { sliceState, getState, getGenericReducerBuilder } from '../'
import getContract from '../../utils/getContract'
import { Market, TcpMulticallViewOnly } from "../../utils/typechain/"
import { ProtocolContract } from '../contracts'
import { getLocalStorage, mnt } from '../../utils'
import { executeMulticall, rc } from '../../utils/Multicall'

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
  valueOfLendTokensInHue: number,
}

export interface MarketState extends sliceState<marketInfo> {}

export const getMarketInfo = createAsyncThunk(
  'market/getMarketInfo',
  async (args: marketArgs): Promise<marketInfo> => {
    const market = getContract(args.Market, ProtocolContract.Market) as Market
    const multicall = getContract(args.TcpMulticall, ProtocolContract.TcpMulticall, true) as unknown as TcpMulticallViewOnly

    return (await executeMulticall(
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
        valueOfLendTokensInHue: rc.BigNumberUnscale,
      },
      {
        valueOfLendTokensInHue: [mnt(1)]
      }
    ))
  }
)

export interface lendArgs {
  Market: string,
  amount: number,
}

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
