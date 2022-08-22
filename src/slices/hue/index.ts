import { thunkArgs, RootState } from '../fetchNodes'
import getContract, { getMulticallContract } from '../../utils/getContract'
import { executeMulticalls, oneContractManyFunctionMC } from '@trustlessfi/multicall'
import { Hue } from '@trustlessfi/typechain'
import ProtocolContract from '../contracts/ProtocolContract'
import { createChainDataSlice } from '../'
import { unscale } from '../../utils'

export interface hueInfo {
  totalSupply: number
  decimals: number
}

const hueSlice = createChainDataSlice({
  name: 'hue',
  dependencies: ['rootContracts', 'contracts'],
  stateSelector: (state: RootState) => state.hueInfo,
  thunkFunction:
    async (args: thunkArgs<'rootContracts' | 'contracts'>) => {
      const hue = getContract<Hue>(ProtocolContract.Hue, args.contracts.Hue)
      const trustlessMulticall = getMulticallContract(args.rootContracts.trustlessMulticall)

      const { hueInfo } = await executeMulticalls(
        trustlessMulticall,
        {
          hueInfo: oneContractManyFunctionMC(
            hue,
            {
              totalSupply: [],
              decimals: [],
            },
          )
        }
      )

      return {
        totalSupply: unscale(hueInfo.totalSupply, hueInfo.decimals),
        decimals: hueInfo.decimals,
      }
    },
})

export default hueSlice
