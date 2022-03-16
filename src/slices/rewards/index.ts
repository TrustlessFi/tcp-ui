import getContract, { getMulticallContract } from '../../utils/getContract'
import { Rewards } from '@trustlessfi/typechain'
import ProtocolContract from '../contracts/ProtocolContract'
import { executeMulticalls, rc, oneContractManyFunctionMC } from '@trustlessfi/multicall'
import { thunkArgs, RootState  } from '../fetchNodes'
import { createChainDataSlice, CacheDuration } from '../'

export interface rewardsInfo {
  weth: string
  countPools: number
  firstPeriod: number
  periodLength: number
}

const rewardsInfoSlice = createChainDataSlice({
  name: 'rewards',
  dependencies: ['contracts', 'rootContracts'],
  cacheDuration: CacheDuration.SHORT,
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

export default rewardsInfoSlice
