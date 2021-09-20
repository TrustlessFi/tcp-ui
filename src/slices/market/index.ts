import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { sliceState, getState, getGenericReducerBuilder } from '../'
import { unscale } from '../../utils'
import getContract from '../../utils/getContract'
import { Market } from "../../utils/typechain/Market"
import { ProtocolContract } from '../contracts'
import { getLocalStorage } from '../../utils/index'
import Multicall from '../../utils/Multicall'
import { BigNumber } from 'ethers'


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
      const market = getContract(args.Market, ProtocolContract.Market) as Market

      const multicall = Multicall(market)
      multicall.add([
        'lastPeriodGlobalInterestAccrued',
        'collateralizationRequirement',
        'minPositionSize',
        'twapDuration',
        'interestPortionToLenders',
        'periodLength',
        'firstPeriod',
      ])

      const [
        lastPeriodGlobalInterestAccrued,
        collateralizationRequirement,
        minPositionSize,
        twapDuration,
        interestPortionToLenders,
        periodLength,
        firstPeriod,
      ] = await multicall.execute() as [
        BigNumber,
        BigNumber,
        BigNumber,
        number,
        BigNumber,
        BigNumber,
        BigNumber,
      ]


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
