import { thunkArgs, RootState  } from '../fetchNodes'
import { createChainDataSlice } from '../'
import ProtocolContract from '../contracts/ProtocolContract'
import getContract, { getMulticallContract, contract } from '../../utils/getContract'
import {
  executeMulticalls,
  manyContractOneFunctionMC,
  oneContractOneFunctionMC,
  oneContractManyFunctionMC,
  idsToNoArg,
  idsToIds,
} from '@trustlessfi/multicall'
import { UniswapV3Pool, Accounting, Rewards, CharmWrapper } from '@trustlessfi/typechain'
import poolArtifact from '@trustlessfi/artifacts/dist/@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json'
import charmWrapperArtifact from '@trustlessfi/artifacts/dist/contracts/charm/CharmWrapper.sol/CharmWrapper.json'
import {
  sqrtPriceX96ToTick, timeToPeriod, bnf,
  unscale
} from '../../utils'

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
            'pool',
            idsToNoArg(charmPoolAddresses),
          ),
          userLiquidityPositions: oneContractOneFunctionMC(
            accounting,
            'getPoolPosition',
            Object.fromEntries(
              charmPoolAddresses.map(
                poolAddress => [poolAddress, [args.userAddress, poolAddress] as [string, string]]
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
            'slot0',
            idsToNoArg(Object.values(uniswapPoolAddresses)),
          ),
          currentRewardsInfo: oneContractManyFunctionMC(
            rewards,
            {
              lastPeriodGlobalRewardsAccrued: [],
              currentPeriod: [],
            }
          ),
          minLiquidityByPeriod: oneContractOneFunctionMC(
            rewards,
            'getMinLiquidityByPeriod',
            idsToIds(charmPoolAddresses),
          ),
          rs: oneContractOneFunctionMC(
            accounting,
            'getRewardStatus',
            idsToIds(charmPoolAddresses),
          ),
          poolsLiquidity: oneContractOneFunctionMC(
            accounting,
            'poolLiquidity',
            idsToIds(charmPoolAddresses),
          ),
        }
      )

      return Object.fromEntries(charmPoolAddresses.map(address => {

        let approximateRewards = bnf(0)
        const lastTimePositionRewarded = userLiquidityPositions[address].lastTimeRewarded.toNumber()
        const lastPeriodGlobalRewardsAccrued = currentRewardsInfo.lastPeriodGlobalRewardsAccrued.toNumber()

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
          instantTick: sqrtPriceX96ToTick(sqrtPriceX96Instant[uniswapPoolAddresses[address]].toString()),
          poolLiquidity: poolsLiquidity[address].toString(),
          cumulativeLiquidity: rs[address].cumulativeLiquidity.toString(),
          totalRewards: rs[address].totalRewards.toString(),
          lastPeriodGlobalRewardsAccrued,
          currentPeriod: currentRewardsInfo.currentPeriod.toNumber(),
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
