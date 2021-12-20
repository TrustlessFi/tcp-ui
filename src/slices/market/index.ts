import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { sliceState, getStateWithValue, getGenericReducerBuilder } from '../'
import getContract, { getMulticallContract } from '../../utils/getContract'
import { Market } from '@trustlessfi/typechain'
import { ProtocolContract, ContractsInfo } from '../contracts'
import { getLocalStorage, mnt } from '../../utils'
import { executeMulticalls, oneContractManyFunctionMC, rc } from '@trustlessfi/multicall'

export interface marketArgs {
  contracts: ContractsInfo
  trustlessMulticall: string
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
    const market = getContract(args.contracts[ProtocolContract.Market], ProtocolContract.Market) as Market
    const trustlessMulticall = getMulticallContract(args.trustlessMulticall)

    const { marketInfo } = await executeMulticalls(
      trustlessMulticall,
      {
        marketInfo: oneContractManyFunctionMC(
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
        )
      }
    )
    
    return marketInfo
  }
)

export interface lendArgs {
  Market: string,
  amount: number,
}

const name = 'market'

export const marketSlice = createSlice({
  name,
  initialState: getStateWithValue<marketInfo>(getLocalStorage(name, null)) as MarketState,
  reducers: {
    clearMarketInfo: (state) => {
      state.data.value = null
    },
  },
  extraReducers: (builder) => {
    builder = getGenericReducerBuilder(builder, getMarketInfo)
  },
})

export const { clearMarketInfo } = marketSlice.actions

export default marketSlice.reducer
