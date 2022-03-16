import getContract, { getMulticallContract } from '../../utils/getContract'
import { EthERC20 } from '@trustlessfi/typechain'
import ProtocolContract from '../contracts/ProtocolContract'
import { executeMulticalls, rc, oneContractManyFunctionMC } from '@trustlessfi/multicall'
import { thunkArgs, RootState  } from '../fetchNodes'
import { createChainDataSlice, CacheDuration } from '../'

export interface ethERC20Info {
  isAuthorized: boolean
  isAdmin: boolean
}

const ethERC20Slice = createChainDataSlice({
  name: 'ethERC20',
  dependencies: ['contracts', 'rootContracts', 'userAddress'],
  cacheDuration: CacheDuration.SHORT,
  isUserData: true,
  stateSelector: (state: RootState) => state.ethERC20Info,
  thunkFunction:
    async (args: thunkArgs<'contracts' | 'rootContracts' | 'userAddress'>) => {
      const ethERC20 = getContract<EthERC20>(ProtocolContract.EthERC20, args.contracts.EthERC20)
      const trustlessMulticall = getMulticallContract(args.rootContracts.trustlessMulticall)

      const { ethERC20Data } = await executeMulticalls(
        trustlessMulticall,
        {
          ethERC20Data: oneContractManyFunctionMC(
            ethERC20,
            {
              admin: rc.String,
              authorized: rc.Boolean,
            },
            {
              authorized: [args.userAddress]
            }
          ),
        }
      )

      const result = {
        isAuthorized: ethERC20Data.authorized,
        isAdmin: args.userAddress === ethERC20Data.admin,
      }
      return result
    },
})

export default ethERC20Slice
