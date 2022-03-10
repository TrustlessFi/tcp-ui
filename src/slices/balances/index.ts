import { thunkArgs, RootState } from '../fetchNodes'
import { createChainDataSlice } from '../'
import * as zkSync from 'zksync-web3'
import * as ethers from 'ethers'
import getProvider, { getZkSyncProvider } from '../../utils/getProvider'
import {
  unscale, uint255Max, addressToERC20, zeroAddress, zkSyncEthERC20Address,
} from '../../utils'
import { getMulticallContract } from '../../utils/getContract'
import {
  executeMulticalls,
  rc,
  oneContractManyFunctionMC,
  manyContractOneFunctionMC,
} from '@trustlessfi/multicall'
import ProtocolContract from '../contracts/ProtocolContract'

export interface balances {
  userEthBalance: number
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
        [ProtocolContract.Accounting]: number
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

      const tokenAddresses = [args.contracts.Hue, args.contracts.LendHue, args.contracts.Tcp]
      // eslint-disable-next-line array-callback-return
      Object.values(args.poolsMetadata).map(pool => {
        const addAddress = (address: string) => {
          if (!tokenAddresses.includes(pool.token0.address) && address !== args.rewardsInfo.weth) {
            tokenAddresses.push(address)
          }
        }
        addAddress(pool.token0.address)
        addAddress(pool.token1.address)
      })

      const {
        userEthERC20Balance,
        userBalance,
        marketApprovals,
        rewardsApprovals,
        accountingBalance
      } = await executeMulticalls(
        multicall,
        {
          userEthERC20Balance: oneContractManyFunctionMC(
            addressToERC20(zkSyncEthERC20Address),
            { balanceOf: rc.BigNumberUnscale },
            { balanceOf: [args.userAddress] },
          ),
          userBalance: manyContractOneFunctionMC(
            tokenContract,
            Object.fromEntries(tokenAddresses.map(address => [address, [args.userAddress]])),
            'balanceOf',
            rc.BigNumber
          ),
          accountingBalance: manyContractOneFunctionMC(
            tokenContract,
            Object.fromEntries(tokenAddresses.map(address => [address, [args.contracts.Accounting]])),
            'balanceOf',
            rc.BigNumber
          ),
          marketApprovals: manyContractOneFunctionMC(
            tokenContract,
            Object.fromEntries(tokenAddresses.map(address => [address, [args.userAddress, args.contracts.Market]])),
            'allowance',
            rc.BigNumber,
          ),
          rewardsApprovals: manyContractOneFunctionMC(
            tokenContract,
            Object.fromEntries(tokenAddresses.map(address => [address, [args.userAddress, args.contracts.Rewards]])),
            'allowance',
            rc.BigNumber,
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
        userEthBalance: userEthERC20Balance.balanceOf,
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
              [ProtocolContract.Accounting]: unscale(accountingBalance[address], decimals),
            }
          }]
        }))
      }
    }
})

export default balancesSlice
