import { thunkArgs, RootState } from '../fetchNodes'
import getContract, { getMulticallContract } from '../../utils/getContract'
import { executeMulticalls, oneContractManyFunctionMC } from '@trustlessfi/multicall'
import { HuePositionNFT } from '@trustlessfi/typechain'
import ProtocolContract from '../contracts/ProtocolContract'
import { createChainDataSlice } from '../'
import { unscale } from '../../utils'

export interface huePositionNftInfo {
  totalSupply: number
  nextPositionID: number
}

const huePositionNftSlice = createChainDataSlice({
  name: 'huePositionNft',
  dependencies: ['rootContracts', 'contracts'],
  stateSelector: (state: RootState) => state.huePositionNftInfo,
  thunkFunction:
    async (args: thunkArgs<'rootContracts' | 'contracts'>) => {
      const huePositionNft = getContract<HuePositionNFT>(ProtocolContract.HuePositionNFT, args.contracts.HuePositionNFT)
      const trustlessMulticall = getMulticallContract(args.rootContracts.trustlessMulticall)

      const { huePositionNftInfo } = await executeMulticalls(
        trustlessMulticall,
        {
          huePositionNftInfo: oneContractManyFunctionMC(
            huePositionNft,
            {
              totalSupply: [],
              nextPositionID: [],
            },
          )
        }
      )

      return {
        totalSupply: huePositionNftInfo.totalSupply.toNumber(),
        nextPositionID: huePositionNftInfo.nextPositionID.toNumber(),
      }
    },
})

export default huePositionNftSlice
