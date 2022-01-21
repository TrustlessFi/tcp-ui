import { RootState } from '../../app/store'
import getContract, { getMulticallContract } from '../../utils/getContract'
import { Liquidations } from '@trustlessfi/typechain'
import ProtocolContract from '../contracts/ProtocolContract'
import { executeMulticalls, oneContractManyFunctionMC, rc } from '@trustlessfi/multicall'
import { thunkArgs } from '../fetchNodes'
import { createChainDataSlice } from '../'

export interface liquidationsInfo {
  twapDuration: number
  discoveryIncentive: number
  liquidationIncentive: number
}

const partialLiquidationsSlice = createChainDataSlice({
  name: 'liquidations',
  dependencies: ['contracts', 'rootContracts'],
  thunkFunction:
    async (args: thunkArgs<'contracts' | 'rootContracts'>) => {
      const liquidations = getContract(args.contracts[ProtocolContract.Liquidations], ProtocolContract.Liquidations) as Liquidations
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

export const liquidationsSlice = {
  ...partialLiquidationsSlice,
  stateSelector: (state: RootState) => state.liquidations
}

export default partialLiquidationsSlice.slice.reducer
