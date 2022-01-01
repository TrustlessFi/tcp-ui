import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import getContract, { getMulticallContract } from '../../utils/getContract'
import { ProtocolContract } from '../contracts'
import { PromiseType } from '@trustlessfi/utils'
import { executeMulticalls, oneContractOneFunctionMC } from '@trustlessfi/multicall'

import { Accounting } from '@trustlessfi/typechain'

import { sliceState, initialState } from '../'
import { getGenericReducerBuilder } from '../'
import { contractsInfo } from '../contracts'
import { poolsCurrentInfo } from '../poolsCurrentData'
import { poolsMetadata } from '../poolsMetadata'
import { rewardsInfo } from '../rewards'
import { bnf, timeToPeriod, unscale } from '../../utils'

export interface LiquidityPosition {
  positionID: string
  poolID: number
  lastBlockPositionIncreased: number
  liquidity: string
  owner: string
  tickLower: number
  tickUpper: number
  approximateRewards: number
}

export interface liquidityPositions { [id: string]: LiquidityPosition }

export interface liquidityPositionsArgs {
  contracts: contractsInfo
  trustlessMulticall: string
  userAddress: string
  poolsCurrentData: poolsCurrentInfo
  poolsMetadata: poolsMetadata
  rewardsInfo: rewardsInfo
}

export interface LiquidityPositionsState extends sliceState<liquidityPositions> {}

export const getLiquidityPositions = createAsyncThunk(
  'liquidityPositions/getLiquidityPositions',
  async (args: liquidityPositionsArgs): Promise<liquidityPositions> => {
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
        const avgDebtPerPeriod =
          bnf(args.poolsCurrentData[poolAddress].cumulativeLiquidity).sub(position.cumulativeLiquidity)
            .div(args.poolsCurrentData[poolAddress].lastPeriodGlobalRewardsAccrued - lastPeriodRewarded)

        if (!avgDebtPerPeriod.isZero()) {
          approximateRewardsBN =
            bnf(position.liquidity)
              .mul(bnf(args.poolsCurrentData[poolAddress].totalRewards).sub(position.totalRewards))
              .div(avgDebtPerPeriod)
              // TODO add in scaling for missing periods
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

export const liquidityPositionsSlice = createSlice({
  name: 'liquidityPositions',
  initialState: initialState as LiquidityPositionsState,
  reducers: {
    clearLiquidityPositions: (state) => {
      state.data.value = null
    },
  },
  extraReducers: (builder) => {
    getGenericReducerBuilder(builder, getLiquidityPositions)
  },
})

export const { clearLiquidityPositions } = liquidityPositionsSlice.actions

export default liquidityPositionsSlice.reducer
