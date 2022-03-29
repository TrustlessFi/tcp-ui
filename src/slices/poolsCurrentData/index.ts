import { thunkArgs, RootState  } from '../fetchNodes'
import { createChainDataSlice } from '../'
import ProtocolContract from '../contracts/ProtocolContract'
import getContract, { getMulticallContract, contract } from '../../utils/getContract'
import {
  executeMulticalls,
  manyContractOneFunctionMC,
  oneContractOneFunctionMC,
  oneContractManyFunctionMC,
  rc,
  idToIdAndNoArg,
  idToIdAndArg,
} from '@trustlessfi/multicall'
import { UniswapV3Pool, Accounting, Rewards, CharmWrapper } from '@trustlessfi/typechain'
import poolArtifact from '@trustlessfi/artifacts/dist/@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json'
import charmWrapperArtifact from '@trustlessfi/artifacts/dist/contracts/charm/CharmWrapper.sol/CharmWrapper.json'
import {
  sqrtPriceX96ToTick, PromiseType, timeToPeriod, bnf,
  unscale
} from '../../utils'

type poolPosition = PromiseType<ReturnType<Accounting['getPoolPosition']>>

export interface poolsCurrentData {
  [poolID: string]: {
    sqrtPriceX96: string
    instantTick: number
    poolLiquidity: string
    cumulativeLiquidity: string
    totalRewards: string
    lastPeriodGlobalRewardsAccrued: number
    currentPeriod: number
    poolID: number
    minLiquidityByPeriod: {
      period: number
      minLiquidity: string
    }
    userLiquidityPosition: {
      cumulativeLiquidity: string
      kickbackPortion: string
      kickbackDestination: string
      lastBlockPositionIncreased: number
      lastTimeRewarded: number
      liquidity: string
      owner: string
      totalRewards: string
      approximateRewards: number
    }
  }
}

const poolsCurrentDataSlice = createChainDataSlice({
  name: 'poolsCurrentData',
  dependencies: [
    'contracts',
    'rootContracts',
    'poolsMetadata',
    'rewardsInfo',
    'userAddress',
    'currentChainInfo',
  ],
  stateSelector: (state: RootState) => state.poolsCurrentData,
  isUserData: true,
  thunkFunction:
    async (args: thunkArgs<
      'contracts' |
      'rootContracts' |
      'poolsMetadata' |
      'rewardsInfo' |
      'userAddress' |
      'currentChainInfo'
    >) => {
      const rewards = getContract<Rewards>(ProtocolContract.Rewards, args.contracts.Rewards)
      const accounting = getContract<Accounting>(ProtocolContract.Accounting, args.contracts.Accounting)
      const trustlessMulticall = getMulticallContract(args.rootContracts.trustlessMulticall)
      const poolContract = contract<UniswapV3Pool>({abi: poolArtifact.abi})
      const charmWrapper = contract<CharmWrapper>({abi: charmWrapperArtifact.abi})

      const charmPoolAddresses = Object.keys(args.poolsMetadata)

      const { uniswapPoolAddresses, userLiquidityPositions } = await executeMulticalls(
        trustlessMulticall,
        {
          uniswapPoolAddresses: manyContractOneFunctionMC(
            charmWrapper,
            idToIdAndNoArg(charmPoolAddresses),
            'pool',
            rc.String,
          ),
          userLiquidityPositions: oneContractOneFunctionMC(
            accounting,
            'getPoolPosition',
            (result: any) => result as poolPosition,
            Object.fromEntries(
              charmPoolAddresses.map(
                poolAddress => [poolAddress, [args.userAddress, poolAddress]]
              )
            ),
          ),
        }
      )

      const {
        sqrtPriceX96Instant,
        currentRewardsInfo,
        minLiquidityByPeriod,
        rs,
        poolsLiquidity
      } = await executeMulticalls(
        trustlessMulticall,
        {
          sqrtPriceX96Instant: manyContractOneFunctionMC(
            poolContract,
            idToIdAndNoArg(Object.values(uniswapPoolAddresses)),
            'slot0',
            rc.String,
          ),
          currentRewardsInfo: oneContractManyFunctionMC(
            rewards,
            {
              lastPeriodGlobalRewardsAccrued: rc.BigNumberToNumber,
              currentPeriod: rc.BigNumberToNumber,
            }
          ),
          minLiquidityByPeriod: oneContractOneFunctionMC(
            rewards,
            'getMinLiquidityByPeriod',
            (result: any) => result as PromiseType<ReturnType<Rewards['getMinLiquidityByPeriod']>>,
            idToIdAndArg(charmPoolAddresses),
          ),
          rs: oneContractOneFunctionMC(
            accounting,
            'getRewardStatus',
            (result: any) => result as PromiseType<ReturnType<Accounting['getRewardStatus']>>,
            idToIdAndArg(charmPoolAddresses),
          ),
          poolsLiquidity: oneContractOneFunctionMC(
            accounting,
            'poolLiquidity',
            rc.BigNumberToString,
            idToIdAndArg(charmPoolAddresses),
          ),
        }
      )

      return Object.fromEntries(charmPoolAddresses.map(address => {

        let approximateRewards = bnf(0)
        const lastTimePositionRewarded = userLiquidityPositions[address].lastTimeRewarded.toNumber()
        const lastPeriodGlobalRewardsAccrued = currentRewardsInfo.lastPeriodGlobalRewardsAccrued

        const getRewardsPeriodForTime = (time: number) =>
          timeToPeriod(time, args.rewardsInfo.periodLength, args.rewardsInfo.firstPeriod)

        const lastPeriodPositionUpdated = getRewardsPeriodForTime(lastTimePositionRewarded)
        const currentRewardsPeriod = getRewardsPeriodForTime(args.currentChainInfo.blockTimestamp)

        const position = userLiquidityPositions[address]

        if (lastPeriodPositionUpdated < lastPeriodGlobalRewardsAccrued) {
          const rewardsPeriods = lastPeriodGlobalRewardsAccrued - lastPeriodPositionUpdated
          let avgDebtPerPeriod =
            bnf(rs[address].cumulativeLiquidity)
              .sub(position.cumulativeLiquidity)
              .div(lastPeriodGlobalRewardsAccrued - lastPeriodPositionUpdated)

          if (!avgDebtPerPeriod.isZero()) {
            approximateRewards =
              position.liquidity
                .mul(bnf(rs[address].totalRewards).sub(position.totalRewards))
                .div(avgDebtPerPeriod)

            if (lastPeriodGlobalRewardsAccrued < currentRewardsPeriod) {
              const approximateRewardsPerPeriod = approximateRewards.div(rewardsPeriods)
              const extraRewardsPeriods = currentRewardsPeriod - lastPeriodGlobalRewardsAccrued
              approximateRewards = approximateRewards.add(approximateRewardsPerPeriod.mul(extraRewardsPeriods))
            }

          }
        }

        return [address, {
          sqrtPriceX96: sqrtPriceX96Instant[uniswapPoolAddresses[address]].toString(),
          instantTick: sqrtPriceX96ToTick(sqrtPriceX96Instant[uniswapPoolAddresses[address]]),
          poolLiquidity: poolsLiquidity[address],
          cumulativeLiquidity: rs[address].cumulativeLiquidity.toString(),
          totalRewards: rs[address].totalRewards.toString(),
          lastPeriodGlobalRewardsAccrued,
          currentPeriod: currentRewardsInfo.currentPeriod,
          poolID: args.poolsMetadata[address].poolID,
          minLiquidityByPeriod: {
            period: minLiquidityByPeriod[address].period.toNumber(),
            minLiquidity: minLiquidityByPeriod[address].minLiquidity.toString(),
          },
          userLiquidityPosition: {
            cumulativeLiquidity: position.cumulativeLiquidity.toString(),
            kickbackPortion: position.kickbackPortion.toString(),
            kickbackDestination: position.kickbackDestination,
            lastBlockPositionIncreased: position.lastBlockPositionIncreased.toNumber(),
            lastTimeRewarded: lastTimePositionRewarded,
            liquidity: position.liquidity.toString(),
            owner: position.owner,
            totalRewards: position.totalRewards.toString(),
            approximateRewards: unscale(approximateRewards),
          }
        }]}))
    },
})

export default poolsCurrentDataSlice
