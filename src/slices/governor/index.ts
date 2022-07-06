import { thunkArgs, RootState } from '../fetchNodes'
import getContract, { getMulticallContract } from '../../utils/getContract'
import { executeMulticalls, oneContractManyFunctionMC } from '@trustlessfi/multicall'
import { Governor } from '@trustlessfi/typechain'
import { RootContract } from '../contracts/ProtocolContract'
import { createChainDataSlice } from '../'

export interface governorInfo {
  phase: number
}

const partialGovernorSlice = createChainDataSlice({
  name: 'governor',
  dependencies: ['rootContracts'],
  stateSelector: (state: RootState) => state.governorInfo,
  thunkFunction:
    async (args: thunkArgs<'rootContracts'>) => {
      const governor = getContract<Governor>(RootContract.Governor, args.rootContracts.governor)
      const trustlessMulticall = getMulticallContract(args.rootContracts.trustlessMulticall)


      const { governorInfo } = await executeMulticalls(
        trustlessMulticall,
        {
          governorInfo: oneContractManyFunctionMC(
            governor,
            {
              currentPhase: [],
            },
          )
        }
      )

      return { phase: governorInfo.currentPhase }
    },
})

export default partialGovernorSlice
