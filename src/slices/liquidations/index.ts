import getContract, { getMulticallContract } from '../../utils/getContract'
import { Liquidations } from '@trustlessfi/typechain'
import ProtocolContract from '../contracts/ProtocolContract'
import { executeMulticalls, oneContractManyFunctionMC, rc } from '@trustlessfi/multicall'
import { thunkArgs, RootState } from '../fetchNodes'
import { createChainDataSlice } from '../'

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
              twapDuration: rc.Number,
              discoveryIncentive: rc.BigNumberUnscale,
              liquidationIncentive: rc.BigNumberUnscale,
            },
          ),
        }
      )

      return liquidationsInfo
    },
})

export default liquidationsSlice
