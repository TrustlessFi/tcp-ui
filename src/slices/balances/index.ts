import { thunkArgs, RootState } from '../fetchNodes'
import { createChainDataSlice } from '../'
import {
  unscale, uint255Max, addressToERC20, zeroAddress,
} from '../../utils'
import getContract, { getMulticallContract } from '../../utils/getContract'
import {
  executeMulticalls,
  oneContractManyFunctionMC,
  manyContractOneFunctionMC,
  idsToArg,
} from '@trustlessfi/multicall'
import ProtocolContract from '../contracts/ProtocolContract'
import { TruEth } from '@trustlessfi/typechain'

export interface balances {
  userEthBalance: number
  userTruEthBalance: number
  accountingEthBalance: number
  tokens: {
    [tokenAddress: string]:  {
      token: {
        address: string,
        name: string,
        symbol: string,
        decimals: number,
      }
      userBalance: number
      approval: {
        [key in ProtocolContract.Market | ProtocolContract.Rewards]: {
          allowance: string
          approving: boolean
          approved: boolean
        }
      }
      balances: {
      }
    }
  }
}

const balancesSlice = createChainDataSlice({
  name: 'balances',
  dependencies: ['contracts', 'rootContracts', 'userAddress', 'poolsMetadata', 'rewardsInfo'],
  stateSelector: (state: RootState) => state.balances,
  isUserData: true,
  thunkFunction:
    async (args: thunkArgs<'contracts' | 'rootContracts' | 'userAddress' | 'poolsMetadata' | 'rewardsInfo'>) => {
      const multicall = getMulticallContract(args.rootContracts.trustlessMulticall)
      const tokenContract = addressToERC20(zeroAddress)
      const truEth = getContract<TruEth>(ProtocolContract.TruEth, args.contracts.TruEth)

      const tokenAddresses = [args.contracts.Hue, args.contracts.LendHue, args.contracts.Tcp]
      // eslint-disable-next-line array-callback-return
      Object.values(args.poolsMetadata).map(pool => {
        const addAddress = (address: string) => {
          if (!tokenAddresses.includes(address) && address !== args.rewardsInfo.weth) {
            tokenAddresses.push(address)
          }
        }
        addAddress(pool.token0.address)
        addAddress(pool.token1.address)
      })

      tokenAddresses.push(truEth.address)

      const {
        userEthBalance,
        userTruEthBalance,
        accountingTruEthBalance,
        userBalance,
        marketApprovals,
        rewardsApprovals,
      } = await executeMulticalls(
        multicall,
        {
          userEthBalance: oneContractManyFunctionMC(
            multicall,
            { getEthBalance: [args.userAddress] },
          ),
          userTruEthBalance: oneContractManyFunctionMC(
            truEth,
            { balanceOf: [args.userAddress] },
          ),
          accountingTruEthBalance: oneContractManyFunctionMC(
            truEth,
            { balanceOf: [args.contracts.Accounting] },
          ),
          userBalance: manyContractOneFunctionMC(
            tokenContract,
            'balanceOf',
            idsToArg(tokenAddresses, [args.userAddress] as [string]),
          ),
          marketApprovals: manyContractOneFunctionMC(
            tokenContract,
            'allowance',
            idsToArg(tokenAddresses, [args.userAddress, args.contracts.Market] as [string, string]),
          ),
          rewardsApprovals: manyContractOneFunctionMC(
            tokenContract,
            'allowance',
            idsToArg(tokenAddresses, [args.userAddress, args.contracts.Rewards] as [string, string]),
          ),
        }
      )

      const getApprovalFor = (pc: ProtocolContract.Market | ProtocolContract.Rewards, tokenAddress: string) => {
        const value =
          pc  === ProtocolContract.Market
          ? marketApprovals[tokenAddress]
          : rewardsApprovals[tokenAddress]

        return {
          allowance: value.toString(),
          approving: false,
          approved: value.gt(uint255Max),
        }
      }

      type poolTokensMetadata = {
        symbol: string
        name: string
        decimals: number
      }

      const poolsMetadataMap: {[key in string]: poolTokensMetadata} = {}

      // eslint-disable-next-line array-callback-return
      Object.values(args.poolsMetadata).map(md => {
        poolsMetadataMap[md.token0.address] = {
          name: md.token0.name,
          symbol: md.token0.symbol,
          decimals: md.token0.decimals,
        }
        poolsMetadataMap[md.token1.address] = {
          name: md.token1.name,
          symbol: md.token1.symbol,
          decimals: md.token1.decimals,
        }
      })
      poolsMetadataMap[args.contracts.Hue] = {
        name: 'Hue',
        symbol: 'Hue',
        decimals: 18,
      }
      poolsMetadataMap[args.contracts.LendHue] = {
        name: 'Lend Hue',
        symbol: 'LendHue',
        decimals: 18,
      }
      poolsMetadataMap[args.contracts.Tcp] = {
        name: 'Trustless Currency Protocol',
        symbol: 'TCP',
        decimals: 18,
      }

      return {
        userEthBalance: unscale(userEthBalance.getEthBalance),
        userTruEthBalance: unscale(userTruEthBalance.balanceOf),
        accountingEthBalance: unscale(accountingTruEthBalance.balanceOf),
        tokens: Object.fromEntries(tokenAddresses.map(address => {
          const decimals = poolsMetadataMap[address].decimals

          return [address, {
            token: {
              address,
              name: poolsMetadataMap[address].name,
              symbol: poolsMetadataMap[address].symbol,
              decimals,
            },
            userBalance: unscale(userBalance[address], decimals),
            approval: {
              [ProtocolContract.Market]: getApprovalFor(ProtocolContract.Market, address),
              [ProtocolContract.Rewards]: getApprovalFor(ProtocolContract.Rewards, address),
            },
            balances: {
            }
          }]
        }))
      }
    }
})

export default balancesSlice
