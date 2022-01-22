import { RootState } from '../../app/store'
import { thunkArgs } from '../fetchNodes'
import { createChainDataSlice } from '../'
import { getMulticallContract} from '../../utils/getContract'
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

const partialCurrentChainInfoSlice = createChainDataSlice({
  name: 'currentChainInfo',
  dependencies: ['rootContracts'],
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

export const currentChainInfoSlice = {
  ...partialCurrentChainInfoSlice,
  stateSelector: (state: RootState) => state.currentChainInfo
}

export default partialCurrentChainInfoSlice.slice.reducer
