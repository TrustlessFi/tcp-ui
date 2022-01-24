import getContract, { getMulticallContract } from '../../utils/getContract'
import { Rewards } from '@trustlessfi/typechain'
import ProtocolContract from '../contracts/ProtocolContract'
import { executeMulticalls, rc, oneContractManyFunctionMC } from '@trustlessfi/multicall'
import { thunkArgs, RootState  } from '../fetchNodes'
import { createChainDataSlice, CacheDuration } from '../'

export interface rewardsInfo {
  twapDuration: number
  liquidationPenalty: number
  weth: string
  countPools: number
  firstPeriod: number
  periodLength: number
}

const rewardsInfoSlice = createChainDataSlice({
  name: 'rewards',
  dependencies: ['contracts', 'rootContracts'],
  reducers: {
    clearRewardsInfo: (state) => {
      state.value = null
    },
  },
  cacheDuration: CacheDuration.LONG,
  stateSelector: (state: RootState) => state.rewardsInfo,
  thunkFunction:
    async (args: thunkArgs<'contracts' | 'rootContracts'>) => {
      const rewards = getContract(args.contracts[ProtocolContract.Rewards], ProtocolContract.Rewards) as Rewards
      const trustlessMulticall = getMulticallContract(args.rootContracts.trustlessMulticall)

      const { rewardsInfo } = await executeMulticalls(
        trustlessMulticall,
        {
          rewardsInfo: oneContractManyFunctionMC(
            rewards,
            {
              twapDuration: rc.Number,
              liquidationPenalty: rc.BigNumberUnscale,
              weth: rc.String,
              countPools: rc.Number,
              firstPeriod: rc.BigNumberToNumber,
              periodLength: rc.BigNumberToNumber,
            }
          ),
        }
      )

      return rewardsInfo
    },
})

export const { clearRewardsInfo } = rewardsInfoSlice.slice.actions

export default rewardsInfoSlice
