import { thunkArgs, RootState } from '../fetchNodes'
import getContract, { getMulticallContract } from '../../utils/getContract'
import { executeMulticalls, oneContractManyFunctionMC, oneContractOneFunctionMC } from '@trustlessfi/multicall'
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
  imageBaseURI: string
  userBalance: number
  userNftIDs: number[]
}

const nftPyramidSlice = createChainDataSlice({
  name: 'nftPyramid',
  dependencies: ['rootContracts', 'contracts', 'userAddress'],
  stateSelector: (state: RootState) => state.nftPyramid,
  isUserData: true,
  thunkFunction:
    async (args: thunkArgs<'rootContracts' | 'contracts' | 'userAddress'>) => {
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
              imageBaseURI: [],
              balanceOf: [args.userAddress]
            },
          )
        }
      )

      const callArgs: {[key in string]: [string, number]} = {}

      for (let i = 0; i < nftPyramidInfo.balanceOf.toNumber(); i++) {
        callArgs[i.toString()] = [args.userAddress, i]
      }

      const { nftIDs } = await executeMulticalls(
        trustlessMulticall,
        {
          nftIDs: oneContractOneFunctionMC(
            nftPyramid,
            'tokenOfOwnerByIndex',
            callArgs,
          )
        }
      )

      const nftData = {
        supplyCount: nftPyramidInfo.nextTokenId.toNumber() - 1,
        maxMint: nftPyramidInfo.MAX_MINT.toNumber(),
        maxSupply: nftPyramidInfo.MAX_SUPPLY.toNumber(),
        price: unscale(nftPyramidInfo.price),
        mintIsActive: nftPyramidInfo.mintIsActive,
        baseURI: nftPyramidInfo.baseURI,
        imageBaseURI: nftPyramidInfo.imageBaseURI,
        userBalance: nftPyramidInfo.balanceOf.toNumber(),
        userNftIDs: Object.values(nftIDs).map(n => n.toNumber()).sort((a, b) => a - b),
      }

      console.log({nftData})
      return nftData
    },
})

export default nftPyramidSlice
