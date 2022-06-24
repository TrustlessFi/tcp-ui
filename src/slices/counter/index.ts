import { getMulticallContract, getContract } from '../../utils/getContract'
import { oneContractManyFunctionMC, rc, executeMulticalls } from '@trustlessfi/multicall'
import { thunkArgs, RootState  } from '../fetchNodes'
import { createChainDataSlice, CacheDuration } from '../'
import { RootContract } from '../contracts/ProtocolContract'
import { ProtocolDataAggregator } from '@trustlessfi/typechain'

export interface counterInfo {
  counterValue: number
}

const counterInfoSlice = createChainDataSlice({
  name: 'counterInfo',
  dependencies: ['rootContracts'],
  stateSelector: (state: RootState) => state.counterInfo,
  cacheDuration: CacheDuration.NONE,
  thunkFunction:
    async (args: thunkArgs<'rootContracts'>) => {
      const trustlessMulticall = getMulticallContract(args.rootContracts.trustlessMulticall)
      const dataAggregator = getContract<ProtocolDataAggregator>(RootContract.ProtocolDataAggregator, args.rootContracts.protocolDataAggregator)

      const { counter } = await executeMulticalls(
        trustlessMulticall,
        {
          counter: oneContractManyFunctionMC(
            dataAggregator,
            {
              counter: rc.BigNumberToNumber,
            },
          )
        }
      )

      return {
        counterValue: counter.counter
      }
    },
})

export default counterInfoSlice
