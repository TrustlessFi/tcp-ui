import { thunkArgs, RootState } from '../fetchNodes'
import getContract, { getMulticallContract } from '../../utils/getContract'
import { createChainDataSlice } from '../'
import { Hue, TruEth } from '@trustlessfi/typechain'
import ProtocolContract from '../contracts/ProtocolContract'
import { unscale } from '../../utils'
import { executeMulticalls, oneContractManyFunctionMC } from '@trustlessfi/multicall'

export interface protocolBalances {
  accountingHueBalance: number
  accountingTruEthBalance: number
  reserves: number
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

      const { accountingHueBalance, accountingTruEthBalance, reserves } = await executeMulticalls(
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
          ),
          reserves: oneContractManyFunctionMC(
            hue,
            {
              balanceOf: [args.contracts.Hue],
              decimals: [],
            },
          )
        }
      )

      return {
        accountingHueBalance: unscale(accountingHueBalance.balanceOf, accountingHueBalance.decimals),
        accountingTruEthBalance: unscale(accountingTruEthBalance.balanceOf, accountingTruEthBalance.decimals),
        reserves: unscale(reserves.balanceOf, reserves.decimals),
      }
    },
})

export default protocolBalancesSlice
