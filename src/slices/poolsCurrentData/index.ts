import { thunkArgs, RootState  } from '../fetchNodes'
import { createChainDataSlice } from '../'
import { Contract } from 'ethers'
import ProtocolContract from '../contracts/ProtocolContract'
import getProvider from '../../utils/getProvider'
import getContract, { getMulticallContract } from '../../utils/getContract'
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
  sqrtPriceX96ToTick, zeroAddress, PromiseType, timeToPeriod, bnf,
  unscale, first
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
  dependencies: ['contracts', 'rootContracts', 'poolsMetadata', 'rewardsInfo', 'userAddress'],
  stateSelector: (state: RootState) => state.poolsCurrentData,
  isUserData: true,
  thunkFunction:
    async (args: thunkArgs<'contracts' | 'rootContracts' | 'poolsMetadata' | 'rewardsInfo' | 'userAddress'>) => {
      const provider = getProvider()
      const rewards = getContract(args.contracts[ProtocolContract.Rewards], ProtocolContract.Rewards) as Rewards
      const accounting = getContract(args.contracts[ProtocolContract.Accounting], ProtocolContract.Accounting) as Accounting
      const trustlessMulticall = getMulticallContract(args.rootContracts.trustlessMulticall)
      const poolContract = new Contract(zeroAddress, poolArtifact.abi, provider) as UniswapV3Pool
      const charmWrapper = new Contract(zeroAddress, charmWrapperArtifact.abi, provider) as CharmWrapper

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
        const lastTimeRewarded = userLiquidityPositions[address].lastTimeRewarded.toNumber()
        const lastPeriodGlobalRewardsAccrued = currentRewardsInfo.lastPeriodGlobalRewardsAccrued
        const lastPeriodUpdated = timeToPeriod(lastTimeRewarded, args.rewardsInfo.periodLength, args.rewardsInfo.firstPeriod)

        const position = userLiquidityPositions[address]

        console.log({lastPeriodUpdated, lastPeriodGlobalRewardsAccrued})

        if (lastPeriodUpdated < lastPeriodGlobalRewardsAccrued) {
          let avgDebtPerPeriod =
            bnf(rs[address].cumulativeLiquidity)
              .sub(position.cumulativeLiquidity)
              .div(lastPeriodGlobalRewardsAccrued - lastPeriodUpdated)

          if (!avgDebtPerPeriod.isZero()) {
            approximateRewards =
              position.liquidity
                .mul(bnf(rs[address].totalRewards).sub(position.totalRewards))
                .div(avgDebtPerPeriod)
          }

          console.log({avgDebtPerPeriod, approximateRewards})
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
          userLiquidityPosition: {
            cumulativeLiquidity: position.cumulativeLiquidity.toString(),
            kickbackPortion: position.kickbackPortion.toString(),
            kickbackDestination: position.kickbackDestination,
            lastBlockPositionIncreased: position.lastBlockPositionIncreased.toNumber(),
            lastTimeRewarded,
            liquidity: position.liquidity.toString(),
            owner: position.owner,
            totalRewards: position.totalRewards.toString(),
            approximateRewards: unscale(approximateRewards),
          }
        }]}))
    },
})

export default poolsCurrentDataSlice
