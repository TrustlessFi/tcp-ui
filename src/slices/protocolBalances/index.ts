import { thunkArgs, RootState } from '../fetchNodes'
import getContract, { getMulticallContract } from '../../utils/getContract'
import { createChainDataSlice } from '../'
import { Hue, TruEth } from '@trustlessfi/typechain'
import ProtocolContract from '../contracts/ProtocolContract'
import { mnt, unscale } from '../../utils'
import { executeMulticalls, oneContractManyFunctionMC } from '@trustlessfi/multicall'

export interface protocolBalances {
  accountingHueBalance: number
  accountingTruEthBalance: number
}

const protocolBalancesSlice = createChainDataSlice({
  name: 'protocolBalances',
  dependencies: ['contracts', 'rootContracts'],
  stateSelector: (state: RootState) => state.protocolBalances,
  thunkFunction:
    async (args: thunkArgs<'contracts' | 'rootContracts'>) => {
      const trustlessMulticall = getMulticallContract(args.rootContracts.trustlessMulticall)
      const hue = getContract<Hue>(ProtocolContract.Hue, args.contracts.Hue)
      const truEth = getContract<TruEth>(ProtocolContract.TruEth, args.contracts.TruEth)

      const { accountingHueBalance, accountingTruEthBalance } = await executeMulticalls(
        trustlessMulticall,
        {
          accountingHueBalance: oneContractManyFunctionMC(
            hue,
            {
              balanceOf: [args.contracts.Accounting],
              decimals: [],
            },
          ),
          accountingTruEthBalance: oneContractManyFunctionMC(
            truEth,
            {
              balanceOf: [args.contracts.Accounting],
              decimals: [],
            },
          )
        }
      )

      return {
        accountingHueBalance: unscale(accountingHueBalance.balanceOf, accountingHueBalance.decimals),
        accountingTruEthBalance: unscale(accountingTruEthBalance.balanceOf, accountingTruEthBalance.decimals),
      }
    },
})

export default protocolBalancesSlice
