import { RootState } from '../../app/store'
import getContract, { getMulticallContract } from '../../utils/getContract'
import ProtocolContract from '../contracts/ProtocolContract'
import { executeMulticalls, oneContractManyFunctionMC, rc } from '@trustlessfi/multicall'
import { thunkArgs } from '../fetchNodes'
import { createChainDataSlice } from '../'
import { PromiseType } from '@trustlessfi/utils'
import { oneContractOneFunctionMC } from '@trustlessfi/multicall'
import { Accounting } from '@trustlessfi/typechain'
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

export interface liquidityPositions {
  [id: string]: LiquidityPosition
}

const partialLiquidityPositionsSlice = createChainDataSlice({
  name: 'liquidityPositions',
  dependencies: ['contracts', 'rootContracts', 'userAddress', 'poolsCurrentData', 'poolsMetadata', 'rewardsInfo'],
  reducers: {
    clearLiquidityPositions: (state) => {
      state.value = null
    },
  },
  thunkFunction:
    async (args: thunkArgs<'contracts' | 'rootContracts' | 'userAddress' | 'poolsCurrentData' | 'poolsMetadata' | 'rewardsInfo'>) => {
      const accounting = getContract(args.contracts[ProtocolContract.Accounting], ProtocolContract.Accounting) as Accounting
      const trustlessMulticall = getMulticallContract(args.rootContracts.trustlessMulticall)
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
})

export const liquidityPositionsSlice = {
  ...partialLiquidityPositionsSlice,
  stateSelector: (state: RootState) => state.liquidityPositions
}

export const { clearLiquidityPositions } = partialLiquidityPositionsSlice.slice.actions

export default partialLiquidityPositionsSlice.slice.reducer
