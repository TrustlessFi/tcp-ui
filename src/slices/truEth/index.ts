import getContract, { getMulticallContract } from '../../utils/getContract'
import { TruEth } from '@trustlessfi/typechain'
import ProtocolContract from '../contracts/ProtocolContract'
import { executeMulticalls, rc, oneContractManyFunctionMC } from '@trustlessfi/multicall'
import { thunkArgs, RootState  } from '../fetchNodes'
import { createChainDataSlice, CacheDuration } from '../'

export interface truEthInfo {
  isAuthorized: boolean
  isAdmin: boolean
}

const ethERC20Slice = createChainDataSlice({
  name: 'ethERC20',
  dependencies: ['contracts', 'rootContracts', 'userAddress'],
  cacheDuration: CacheDuration.SHORT,
  isUserData: true,
  stateSelector: (state: RootState) => state.truEthInfo,
  thunkFunction:
    async (args: thunkArgs<'contracts' | 'rootContracts' | 'userAddress'>) => {
      const truEth = getContract<TruEth>(ProtocolContract.TruEth, args.contracts.TruEth)
      const trustlessMulticall = getMulticallContract(args.rootContracts.trustlessMulticall)

      const { truEthData } = await executeMulticalls(
        trustlessMulticall,
        {
          truEthData: oneContractManyFunctionMC(
            truEth,
            {
              admin: rc.String,
              isAuthorized: rc.Boolean,
            },
            {
              isAuthorized: [args.userAddress]
            }
          ),
        }
      )

      const result = {
        isAuthorized: truEthData.isAuthorized,
        isAdmin: args.userAddress === truEthData.admin,
      }
      return result
    },
})

export default ethERC20Slice
