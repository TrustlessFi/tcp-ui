import getContract, { getMulticallContract } from '../../utils/getContract'
import { TruEth } from '@trustlessfi/typechain'
import ProtocolContract from '../contracts/ProtocolContract'
import { executeMulticalls, rc, oneContractManyFunctionMC } from '@trustlessfi/multicall'
import { thunkArgs, RootState  } from '../fetchNodes'
import { createChainDataSlice, CacheDuration } from '../'
import { addressToERC20, uint255Max } from '../../utils'

export interface truEthInfo {
  isAuthorized: boolean
  isAdmin: boolean
  chainEthIsApproved: boolean
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

      const chainEth = addressToERC20(args.rootContracts.chainEth)

      const { truEthData, chainEthAllowance } = await executeMulticalls(
        trustlessMulticall,
        {
          truEthData: oneContractManyFunctionMC(
            truEth,
            {
              admin: rc.String,
              isAuthorized: rc.Boolean,
            },
            {
              isAuthorized: [args.userAddress],
            }
          ),
          chainEthAllowance: oneContractManyFunctionMC(
            chainEth,
            {
              allowance: rc.BigNumber,
            },
            {
              allowance: [args.userAddress, args.rootContracts.testnetMultiMint],
            }
          ),
        }
      )

      const result = {
        isAuthorized: truEthData.isAuthorized,
        isAdmin: args.userAddress === truEthData.admin,
        chainEthIsApproved: chainEthAllowance.allowance.gt(uint255Max),
      }
      return result
    },
})

export default truEthSlice
