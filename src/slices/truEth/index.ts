import getContract, { getMulticallContract } from '../../utils/getContract'
import { TruEth } from '@trustlessfi/typechain'
import ProtocolContract from '../contracts/ProtocolContract'
import { executeMulticalls, oneContractManyFunctionMC } from '@trustlessfi/multicall'
import { thunkArgs, RootState  } from '../fetchNodes'
import { createChainDataSlice, CacheDuration } from '../'

export interface truEthInfo {
  isAdmin: boolean
  isMinter: boolean
}

const truEthSlice = createChainDataSlice({
  name: 'ethERC20',
  dependencies: ['contracts', 'rootContracts', 'userAddress', 'rootContracts'],
  cacheDuration: CacheDuration.SHORT,
  isUserData: true,
  stateSelector: (state: RootState) => state.truEthInfo,
  thunkFunction:
    async (args: thunkArgs<'contracts' | 'rootContracts' | 'userAddress' | 'rootContracts'>) => {
      const truEth = getContract<TruEth>(ProtocolContract.TruEth, args.contracts.TruEth)
      const trustlessMulticall = getMulticallContract(args.rootContracts.trustlessMulticall)

      const { truEthData } = await executeMulticalls(
        trustlessMulticall,
        {
          truEthData: oneContractManyFunctionMC(
            truEth,
            {
              firstAdmin: [],
              isAdmin: [args.userAddress],
              isMinter: [args.userAddress],
            },
          ),
        }
      )

      const result = {
        isAdmin: args.userAddress === truEthData.firstAdmin || truEthData.isAdmin,
        isMinter: truEthData.isMinter,
      }
      return result
    },
})

export default truEthSlice
