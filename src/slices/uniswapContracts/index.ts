import { Contract } from "ethers"
import { SwapRouter } from '@trustlessfi/typechain'
import { getMulticallContract } from '../../utils/getContract';
import { executeMulticalls, oneContractManyFunctionMC, rc } from '@trustlessfi/multicall'
import routerArtifact from "@trustlessfi/artifacts/dist/contracts/uniswap/uniswap-v3-periphery/contracts/SwapRouter.sol/SwapRouter.json"
import getProvider from '../../utils/getProvider';
import { thunkArgs, RootState  } from '../fetchNodes'
import { createChainDataSlice, CacheDuration } from '../'

export interface uniswapContracts {
  weth: string
  factory: string
}

const uniswapContractsSlice = createChainDataSlice({
  name: 'uniswapContracts',
  dependencies: ['rootContracts'],
  stateSelector: (state: RootState) => state.uniswapContracts,
  cacheDuration: CacheDuration.INFINITE,
  thunkFunction:
    async (args: thunkArgs<'rootContracts'>) => {
      const trustlessMulticall = getMulticallContract(args.rootContracts.trustlessMulticall)
      const router = new Contract(args.rootContracts.router, routerArtifact.abi, getProvider()) as SwapRouter

      const { uniswapContracts } = (await executeMulticalls(
        trustlessMulticall,
        {
          uniswapContracts: oneContractManyFunctionMC(
            router,
            {
              WETH9: rc.String,
              factory: rc.String,
            },
          )
        }
      ))

      return {
        weth: uniswapContracts.WETH9,
        factory: uniswapContracts.factory,
      }
    }
})

export default uniswapContractsSlice
