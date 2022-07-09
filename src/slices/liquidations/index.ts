import getContract, { getMulticallContract } from '../../utils/getContract'
import { Liquidations } from '@trustlessfi/typechain'
import ProtocolContract from '../contracts/ProtocolContract'
import { executeMulticalls, oneContractManyFunctionMC } from '@trustlessfi/multicall'
import { thunkArgs, RootState } from '../fetchNodes'
import { createChainDataSlice } from '../'
import { unscale } from '../../utils'

export interface liquidationsInfo {
  twapDuration: number
  discoveryIncentive: number
  liquidationIncentive: number
}

const liquidationsSlice = createChainDataSlice({
  name: 'liquidations',
  dependencies: ['contracts', 'rootContracts'],
  stateSelector: (state: RootState) => state.liquidationsInfo,
  thunkFunction:
    async (args: thunkArgs<'contracts' | 'rootContracts'>) => {
      const liquidations = getContract<Liquidations>(ProtocolContract.Liquidations, args.contracts.Liquidations)
      const trustlessMulticall = getMulticallContract(args.rootContracts.trustlessMulticall)

      const { liquidationsInfo } = await executeMulticalls(
        trustlessMulticall,
        {
          liquidationsInfo: oneContractManyFunctionMC(
            liquidations,
            {
              twapDuration: [],
              discoveryIncentive: [],
              liquidationIncentive: []
            },
          ),
        }
      )

      return {
        ...liquidationsInfo,
        discoveryIncentive: unscale(liquidationsInfo.discoveryIncentive),
        liquidationIncentive: unscale(liquidationsInfo.liquidationIncentive),
      }
    },
})

export default liquidationsSlice
