import { RootState } from '../../app/store'
import { getThunkDependencies, NonNull } from '../waitFor'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { sliceState, getStateWithValue, getGenericReducerBuilder } from '../'
import getContract, { getMulticallContract } from '../../utils/getContract'
import { Market } from '@trustlessfi/typechain'
import { ProtocolContract, contractsInfo } from '../contracts'
import { getLocalStorage, mnt } from '../../utils'
import { executeMulticalls, oneContractManyFunctionMC, rc } from '@trustlessfi/multicall'

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

const dependencies = getThunkDependencies(['contracts', 'trustlessMulticall'])

export const getMarketInfo = {
  stateSelector: (state: RootState) => state.market,
  dependencies,
  thunk:
    createAsyncThunk(
    'market/getMarketInfo',
    async (args: NonNull<typeof dependencies>): Promise<marketInfo> => {
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
}

const name = 'market'

export const marketSlice = createSlice({
  name,
  initialState: getStateWithValue(getLocalStorage(name)) as sliceState<marketInfo>,
  reducers: {
    clearMarketInfo: (state) => {
      state.value = null
    },
  },
  extraReducers: (builder) => {
    builder = getGenericReducerBuilder(builder, getMarketInfo.thunk)
  },
})

export const { clearMarketInfo } = marketSlice.actions

export default marketSlice.reducer
