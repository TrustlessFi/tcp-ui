import { thunkArgs, RootState } from '../fetchNodes'
import { createChainDataSlice, CacheDuration } from '../'
import { getMulticallContract } from '../../utils/getContract'
import {
  executeMulticalls,
  oneContractManyFunctionMC,
} from '@trustlessfi/multicall'

export interface currentChainInfo {
  blockNumber: number
  blockTimestamp: number
  chainID: number
}

const currentChainInfoSlice = createChainDataSlice({
  name: 'currentChainInfo',
  dependencies: ['rootContracts'],
  stateSelector: (state: RootState) => state.currentChainInfo,
  cacheDuration: CacheDuration.NONE,
  thunkFunction:
    async (args: thunkArgs<'rootContracts'>) => {
      const multicall = getMulticallContract(args.rootContracts.trustlessMulticall)

      const { chainInfo } = await executeMulticalls(
        multicall,
        {
          chainInfo: oneContractManyFunctionMC(
            multicall,
            {
              getBlockNumber: [],
              getCurrentBlockTimestamp: [],
              getChainId: [],
            },
          ),
        }
      )

      return {
        blockNumber: chainInfo.getBlockNumber.toNumber(),
        blockTimestamp: chainInfo.getCurrentBlockTimestamp.toNumber(),
        chainID: chainInfo.getChainId.toNumber(),
      }
    }
})

export default currentChainInfoSlice
