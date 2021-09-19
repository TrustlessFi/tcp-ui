import { sliceState } from '../'
import { ChainID } from '../chainID'
import { ethers } from 'ethers'

import { unscale, uint255Max, bnf } from '../../utils'
import getProvider from '../../utils/getProvider'
import { Contract } from 'ethers'

import { ERC20 } from "../../utils/typechain/ERC20"

import erc20Artifact from '../../utils/artifacts/@openzeppelin/contracts/token/ERC20/ERC20.sol/ERC20.json'
import { ProtocolContract } from '../contracts'

interface tokenInfo {
  address: string,
  name: string,
  symbol: string,
  decimals: number,
}

type balances = { [key in ProtocolContract]?: number }

type approval = { [key in ProtocolContract]?: {
  allowance: string,
  approving: boolean,
  approved: boolean
}}

export interface balanceInfo {
  token: tokenInfo
  userBalance: number
  approval: approval
  balances: balances
}

export interface balanceState extends sliceState<balanceInfo> {}

export interface balanceArgs {
  tokenAddress: string,
  userAddress: string,
}

export const tokenBalanceThunk = async (
  args: balanceArgs,
  approvalsList: {contract: ProtocolContract, address: string}[],
  balancesList: {contract: ProtocolContract, address: string}[],
) => {
  const provider = getProvider()
  if (provider === null) return null
  const token: ERC20 = new ethers.Contract(args.tokenAddress, erc20Artifact.abi, provider) as unknown as ERC20

  const approval: approval = {}
  const balances: balances = {}
  const tokenInfo = await tokenAddressToTokenInfo(token.address, provider)

  const [
    _,
    __,
    userBalance,
  ] = await Promise.all([
    Promise.all(approvalsList.map(async item => {
      const allowance = await token.allowance(args.userAddress, item.address)
      approval[item.contract] = {
        allowance: allowance.toString(),
        approving: false,
        approved: allowance.gt(bnf(uint255Max))
      }
    })),
    Promise.all(balancesList.map(async item => {
      balances[item.contract] = unscale(await token!.balanceOf(item.address), tokenInfo.decimals)
    })),
    token.balanceOf(args.userAddress),
  ])

  return { token: tokenInfo, userBalance: unscale(userBalance, tokenInfo.decimals), approval, balances}
}

const tokenAddressToTokenInfo = async (tokenAddress: string, provider: ethers.providers.Web3Provider) => {
  const token = new ethers.Contract(tokenAddress, erc20Artifact.abi, provider) as unknown as ERC20
  const [ name, symbol, decimals] = await Promise.all([
    token.name(),
    token.symbol(),
    token.decimals(),
  ])
  return { address: tokenAddress, name, symbol, decimals }
}
