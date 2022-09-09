import { thunkArgs, RootState } from '../fetchNodes'
import getContract, { getMulticallContract } from '../../utils/getContract'
import { executeMulticalls, oneContractManyFunctionMC } from '@trustlessfi/multicall'
import { RootContract } from '../contracts/ProtocolContract'
import { createChainDataSlice } from '../'
import { unscale } from '../../utils'
import { TrustlessPyramidNft } from '../../pyramid-artifacts/typechain'

export interface nftPyramid {
  supplyCount: number
  maxMint: number
  maxSupply: number
  price: number
  mintIsActive: boolean
  baseURI: string
}

const nftPyramidSlice = createChainDataSlice({
  name: 'nftPyramid',
  dependencies: ['rootContracts', 'contracts'],
  stateSelector: (state: RootState) => state.nftPyramid,
  thunkFunction:
    async (args: thunkArgs<'rootContracts' | 'contracts'>) => {
      const nftPyramid = getContract<TrustlessPyramidNft>(RootContract.NftPyramid, args.rootContracts.nftPyramid)
      const trustlessMulticall = getMulticallContract(args.rootContracts.trustlessMulticall)

      const { nftPyramidInfo } = await executeMulticalls(
        trustlessMulticall,
        {
          nftPyramidInfo: oneContractManyFunctionMC(
            nftPyramid,
            {
              nextTokenId: [],
              MAX_MINT: [],
              MAX_SUPPLY: [],
              price: [],
              mintIsActive: [],
              baseURI: [],
            },
          )
        }
      )

      return {
        supplyCount: nftPyramidInfo.nextTokenId.toNumber() - 1,
        maxMint: nftPyramidInfo.MAX_MINT.toNumber(),
        maxSupply: nftPyramidInfo.MAX_SUPPLY.toNumber(),
        price: unscale(nftPyramidInfo.price),
        mintIsActive: nftPyramidInfo.mintIsActive,
        baseURI: nftPyramidInfo.baseURI,
      }
    },
})

export default nftPyramidSlice
