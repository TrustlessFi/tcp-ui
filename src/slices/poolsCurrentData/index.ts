import { RootState } from '../../app/store'
import { thunkArgs } from '../fetchNodes'
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
import { Prices, UniswapV3Pool, Accounting, Rewards } from '@trustlessfi/typechain'
import poolArtifact from '@trustlessfi/artifacts/dist/@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json'
import { sqrtPriceX96ToTick, zeroAddress, PromiseType } from '../../utils'

export interface poolsCurrentData {
  [poolID: string]: {
    instantTick: number
    twapTick: number
    poolLiquidity: string
    cumulativeLiquidity: string
    totalRewards: string
    lastPeriodGlobalRewardsAccrued: number
    currentPeriod: number
  }
}

const partialPoolsCurrentDataSlice = createChainDataSlice({
  name: 'poolsCurrentData',
  dependencies: ['contracts', 'rootContracts', 'poolsMetadata', 'rewardsInfo'],
  reducers: {
    clearPoolsCurrentData: (state) => {
      state.value = null
    },
  },
  thunkFunction:
    async (args: thunkArgs<'contracts' | 'rootContracts' | 'poolsMetadata' | 'rewardsInfo'>) => {
      const provider = getProvider()
      const prices = getContract(args.contracts[ProtocolContract.Prices], ProtocolContract.Prices) as Prices
      const rewards = getContract(args.contracts[ProtocolContract.Rewards], ProtocolContract.Rewards) as Rewards
      const accounting = getContract(args.contracts[ProtocolContract.Accounting], ProtocolContract.Accounting) as Accounting
      const trustlessMulticall = getMulticallContract(args.rootContracts.trustlessMulticall)
      const poolContract = new Contract(zeroAddress, poolArtifact.abi, provider) as UniswapV3Pool

      const poolAddresses = Object.keys(args.poolsMetadata)

      const {
        sqrtPriceX96Instant,
        tickTwapped,
        currentRewardsInfo,
        rs,
        poolsLiquidity
      } = await executeMulticalls(
        trustlessMulticall,
        {
          sqrtPriceX96Instant: manyContractOneFunctionMC(
            poolContract,
            idToIdAndNoArg(poolAddresses),
            'slot0',
            rc.String,
          ),
          tickTwapped: oneContractOneFunctionMC(
            prices,
            'calculateInstantTwappedTick',
            rc.Number,
            Object.fromEntries(poolAddresses.map(address => [address, [address, args.rewardsInfo.twapDuration]]))
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
            idToIdAndArg(poolAddresses),
          ),
          poolsLiquidity: oneContractOneFunctionMC(
            accounting,
            'poolLiquidity',
            rc.BigNumberToString,
            idToIdAndArg(poolAddresses),
          ),
        }
      )

      return Object.fromEntries(poolAddresses.map(address => [address, {
        instantTick: sqrtPriceX96ToTick(sqrtPriceX96Instant[address]),
        twapTick: tickTwapped[address],
        poolLiquidity: poolsLiquidity[address],
        cumulativeLiquidity: rs[address].cumulativeLiquidity.toString(),
        totalRewards: rs[address].totalRewards.toString(),
        lastPeriodGlobalRewardsAccrued: currentRewardsInfo.lastPeriodGlobalRewardsAccrued,
        currentPeriod: currentRewardsInfo.currentPeriod,
      }]))
    },
})

export const poolsCurrentDataSlice = {
  ...partialPoolsCurrentDataSlice,
  stateSelector: (state: RootState) => state.poolsCurrentData
}

export const { clearPoolsCurrentData } = partialPoolsCurrentDataSlice.slice.actions

export default partialPoolsCurrentDataSlice.slice.reducer
