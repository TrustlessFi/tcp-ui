import { sliceState } from '../'
import { Contract } from 'ethers'
import { initialState, getGenericReducerBuilder } from '../'
import { unscale, uint255Max, zeroAddress } from '../../utils'
import erc20Artifact from '@trustlessfi/artifacts/dist/@openzeppelin/contracts/token/ERC20/ERC20.sol/ERC20.json'
import { ProtocolContract, ContractsInfo } from '../contracts'
import { getMulticallContract, contract } from '../../utils/getContract'
import { executeMulticalls, rc, getCustomMulticall, getFullSelector, getMulticall } from '@trustlessfi/multicall'
import { poolsMetadata } from '../poolsMetadata'
import { rewardsInfo } from '../rewards'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import getProvider from '../../utils/getProvider'
import { ERC20 } from '@trustlessfi/typechain'

export interface tokenInfo {
  address: string,
  name: string,
  symbol: string,
  decimals: number,
}

type balances = {
  [ProtocolContract.Accounting]: number
}

export interface approval {
  allowance: string
  approving: boolean
  approved: boolean
}

interface approvals {
  [ProtocolContract.Market]: approval
  [ProtocolContract.Rewards]: approval
}

type tokenBalances = {
  [key in string]:  {
    token: tokenInfo
    userBalance: number
    approval: approvals
    balances: balances
  }
}

export interface balancesInfo {
  userEthBalance: number
  tokens: tokenBalances
}

export interface balanceState extends sliceState<balancesInfo> {}

export interface balanceArgs {
  userAddress: string,
  trustlessMulticall: string,
  poolsMetadata: poolsMetadata
  rewardsInfo: rewardsInfo
  contracts: ContractsInfo
}

export const getBalances = createAsyncThunk(
  'balances/getBalances',
  async (
    args: balanceArgs,
  ): Promise<balancesInfo> => {
    const provider = getProvider()
    const multicall = getMulticallContract(args.trustlessMulticall)
    const tokenContract = new Contract(zeroAddress, erc20Artifact.abi, provider) as ERC20

    const tokenAddresses = [args.contracts.Hue, args.contracts.LendHue, args.contracts.Tcp]
    Object.values(args.poolsMetadata).map(pool => {
      const addAddress = (address: string) => {
        if (!tokenAddresses.includes(pool.token0.address) && address != args.rewardsInfo.weth) {
          tokenAddresses.push(address)
        }
      }
      addAddress(pool.token0.address)
      addAddress(pool.token1.address)
    })

    const {
      userEthBalance,
      userBalance,
      marketApprovals,
      rewardsApprovals,
      accountingBalance
    } = await executeMulticalls(
      multicall,
      {
        userEthBalance: getMulticall(
          multicall,
          { getEthBalance: rc.BigNumber },
          { getEthBalance: [args.userAddress] },
        ),
        userBalance: getCustomMulticall(
          tokenContract,
          Object.fromEntries(
            tokenAddresses.map(address => [getFullSelector(tokenContract, address, 'balanceOf', [args.userAddress]), rc.BigNumber]
          )
        )),
        marketApprovals: getCustomMulticall(
          tokenContract,
          Object.fromEntries(
            tokenAddresses.map(address => [getFullSelector(tokenContract, address, 'allowance', [args.userAddress, args.contracts.Market]), rc.BigNumber]
          )
        )),
        rewardsApprovals: getCustomMulticall(
          tokenContract,
          Object.fromEntries(
            tokenAddresses.map(address => [getFullSelector(tokenContract, address, 'allowance', [args.userAddress, args.contracts.Rewards]), rc.BigNumber]
          )
        )),
        accountingBalance: getCustomMulticall(
          tokenContract,
          Object.fromEntries(
            tokenAddresses.map(address => [getFullSelector(tokenContract, address, 'balanceOf', [args.contracts.Accounting]), rc.BigNumber]
          )
        ))
      }
    )

    const getApprovalFor = (pc: ProtocolContract.Market | ProtocolContract.Rewards, tokenAddress: string) => {
      const value =
        pc  === ProtocolContract.Market
        ? marketApprovals[getFullSelector(tokenContract, tokenAddress, 'allowance', [args.userAddress, args.contracts.Market])]
        : rewardsApprovals[getFullSelector(tokenContract, tokenAddress, 'allowance', [args.userAddress, args.contracts.Rewards])]

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
      tokens: Object.fromEntries(tokenAddresses.map(address => {
        const decimals = poolsMetadataMap[address].decimals

        return [address, {
          token: {
            address,
            name: poolsMetadataMap[address].name,
            symbol: poolsMetadataMap[address].symbol,
            decimals,
          },
          userBalance: unscale(userBalance[getFullSelector(tokenContract, address, 'balanceOf', [args.userAddress])], decimals),
          approval: {
            [ProtocolContract.Market]: getApprovalFor(ProtocolContract.Market, address),
            [ProtocolContract.Rewards]: getApprovalFor(ProtocolContract.Rewards, address),
          },
          balances: {
            [ProtocolContract.Accounting]: unscale(accountingBalance[getFullSelector(tokenContract, address, 'balanceOf', [args.contracts.Accounting])], decimals),
          }
        }]
      }))
    }
  }
)

const name = 'balances'

export const balancesSlice = createSlice({
  name,
  initialState: initialState as balanceState,
  reducers: {
    clearBalances: (state) => {
      state.data.value = null
    },
  },
  extraReducers: (builder) => {
    builder = getGenericReducerBuilder(builder, getBalances)
  },
})

export const { clearBalances } = balancesSlice.actions

export default balancesSlice.reducer
