import { Contract } from "ethers"
import { SwapRouter } from '@trustlessfi/typechain'
import { getMulticallContract } from '../../utils/getContract';
import { executeMulticalls, oneContractManyFunctionMC, rc } from '@trustlessfi/multicall'
import routerArtifact from "@trustlessfi/artifacts/dist/contracts/uniswap/uniswap-v3-periphery/contracts/SwapRouter.sol/SwapRouter.json"
import getProvider from '../../utils/getProvider';
import { RootState } from '../../app/store'
import { thunkArgs } from '../fetchNodes'
import { createChainDataSlice } from '../'

export enum UniswapContract {
  Factory = 'Factory',
  Weth = 'Weth',
}

const partialUniswapContractsSlice = createChainDataSlice({
  name: 'uniswapContracts',
  dependencies: ['rootContracts'],
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
        Weth: uniswapContracts.WETH9,
        Factory: uniswapContracts.factory,
      }
    }
})

export const uniswapContractsSlice = {
  ...partialUniswapContractsSlice,
  stateSelector: (state: RootState) => state.uniswapContracts
}

export default partialUniswapContractsSlice.slice.reducer
