import { RootState } from '../../app/store'
import { getThunkDependencies, NonNull, FetchNodes } from '../fetchNodes'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import getContract, { getMulticallContract } from '../../utils/getContract'
import ProtocolContract from '../contracts/ProtocolContract'
import { PromiseType } from '@trustlessfi/utils'
import { executeMulticalls, oneContractOneFunctionMC } from '@trustlessfi/multicall'

import { Accounting } from '@trustlessfi/typechain'

import { sliceState, initialState } from '../'
import { getGenericReducerBuilder } from '../'
import { bnf, timeToPeriod, unscale } from '../../utils'

const dependencies = getThunkDependencies([
  'contracts',
  'trustlessMulticall',
  'userAddress',
  'poolsCurrentData',
  'poolsMetadata',
  'rewardsInfo',
])

export const getLiquidityPositions = {
  stateSelector: (state: RootState) => state.liquidityPositions,
  dependencies,
  thunk:
    createAsyncThunk(
      'liquidityPositions/getLiquidityPositions',
      async (args: NonNull<typeof dependencies>) => {
        const accounting = getContract(args.contracts[ProtocolContract.Accounting], ProtocolContract.Accounting) as Accounting
        const trustlessMulticall = getMulticallContract(args.trustlessMulticall)

        const poolIDToAddress = Object.fromEntries(Object.entries(args.poolsMetadata).map(
          ([poolAddress, poolInfo]) => [poolInfo.poolID, poolAddress]
        ))

        const positionIDs = await accounting.getPoolPositionNftIdsByOwner(args.userAddress)

        const { positions } = await executeMulticalls(trustlessMulticall, {
          positions: oneContractOneFunctionMC(
            accounting,
            'getPoolPosition',
            (result: any) => result as PromiseType<ReturnType<Accounting['getPoolPosition']>>,
            Object.fromEntries(positionIDs.map(positionID => [positionID.toString(), [positionID]]))
          ),
        })

        return Object.fromEntries(Object.entries(positions).map(([positionID, position]) => {
          let approximateRewardsBN = bnf(0)
          const lastTimeRewarded = position.lastTimeRewarded.toNumber()
          const lastPeriodRewarded = timeToPeriod(lastTimeRewarded, args.rewardsInfo.periodLength, args.rewardsInfo.firstPeriod)

          const poolID = position.poolID
          const poolAddress = poolIDToAddress[poolID]

          if (lastPeriodRewarded < args.poolsCurrentData[poolAddress].lastPeriodGlobalRewardsAccrued) {
            const inflationPeriods = args.poolsCurrentData[poolAddress].lastPeriodGlobalRewardsAccrued - lastPeriodRewarded
            const realPeriods = args.poolsCurrentData[poolAddress].currentPeriod - lastPeriodRewarded
            const avgDebtPerPeriod =
              bnf(args.poolsCurrentData[poolAddress].cumulativeLiquidity).sub(position.cumulativeLiquidity)
                .div(inflationPeriods)

            if (!avgDebtPerPeriod.isZero()) {
              approximateRewardsBN =
                bnf(position.liquidity)
                  .mul(bnf(args.poolsCurrentData[poolAddress].totalRewards).sub(position.totalRewards))
                  .div(avgDebtPerPeriod)
                  .mul(realPeriods)
                  .div(inflationPeriods)
            }
          }

          return [
            positionID,
            {
              positionID,
              poolID: position.poolID,
              lastBlockPositionIncreased: position.lastBlockPositionIncreased.toNumber(),
              liquidity: position.liquidity.toString(),
              owner: position.owner,
              tickLower: position.tickLower,
              tickUpper: position.tickUpper,
              approximateRewards: approximateRewardsBN.isZero() ? 0 : unscale(approximateRewardsBN, 18),
            }
          ]
        }
      ))
      }
    )
}

export const liquidityPositionsSlice = createSlice({
  name: 'liquidityPositions',
  initialState: initialState as sliceState<FetchNodes['liquidityPositions']>,
  reducers: {
    clearLiquidityPositions: (state) => {
      state.value = null
    },
  },
  extraReducers: (builder) => {
    getGenericReducerBuilder(builder, getLiquidityPositions.thunk)
  },
})

export const { clearLiquidityPositions } = liquidityPositionsSlice.actions

export default liquidityPositionsSlice.reducer
