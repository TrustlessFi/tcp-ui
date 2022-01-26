import { thunkArgs, RootState } from '../fetchNodes'
import { createChainDataSlice, CacheDuration } from '../'
import { getMulticallContract } from '../../utils/getContract'
import {
  executeMulticalls,
  rc,
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
              getBlockNumber: rc.BigNumberToNumber,
              getCurrentBlockTimestamp: rc.BigNumberToNumber,
              getChainId: rc.BigNumberToNumber,
            },
          ),
        }
      )

      return {
        blockNumber: chainInfo.getBlockNumber,
        blockTimestamp: chainInfo.getCurrentBlockTimestamp,
        chainID: chainInfo.getChainId,
      }
    }
})

export default currentChainInfoSlice
