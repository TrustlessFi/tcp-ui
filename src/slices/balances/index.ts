import { sliceState } from '../'
import { ChainID } from '../chainID'
import { ethers } from 'ethers'

import { getProtocolContract, ProtocolContract } from '../../utils/protocolContracts'
import { unscale, uint255Max, bnf } from '../../utils'
import getProvider from '../../utils/getProvider'
import { Contract } from 'ethers'

import { ERC20 } from "../../utils/typechain/ERC20"

import erc20Artifact from '../../utils/artifacts/@openzeppelin/contracts/token/ERC20/ERC20.sol/ERC20.json'

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
  chainID: ChainID,
  userAddress: string,
}

export const getTokenBalanceThunk = (
  _token: {tokenAddress?: string, contract?: ProtocolContract},
  approvalsList: ProtocolContract[],
  balancesList: ProtocolContract[],
) => async (args: balanceArgs): Promise<balanceInfo | null> => await getTokenBalanceImpl(
  _token,
  approvalsList,
  balancesList,
  args,
)

export const getTokenBalanceImpl = async (
  _token: {tokenAddress?: string, contract?: ProtocolContract},
  approvalsList: ProtocolContract[],
  balancesList: ProtocolContract[],
  args: balanceArgs
) => {
  const provider = getProvider()
  if (provider === null) return null
  let token: ERC20 | null = null
  if (_token.tokenAddress) {
    token = new ethers.Contract(_token.tokenAddress, erc20Artifact.abi, provider) as unknown as ERC20
  } else if (_token.contract) {
    token = await getProtocolContract(args.chainID, _token.contract) as unknown as ERC20 | null
  }
  if (token === null) return null

  const contractsMap: {[key in ProtocolContract]?: Contract | null} = {}

  const onlyUnique = (value: ProtocolContract, index: number, self: ProtocolContract[]) => self.indexOf(value) === index

  await Promise.all(
    [...approvalsList, ...balancesList].filter(onlyUnique).map(async contract => {
      contractsMap[contract] =
        (await getProtocolContract(args.chainID, contract)) as unknown as Contract | null
    }
  ))

  if (Object.values(contractsMap).includes(null)) return null

  let approval: approval = {}
  let balances: balances = {}
  const tokenInfo = await tokenAddressToTokenInfo(token.address, provider);

  const [
    _,
    __,
    userBalance,
  ] = await Promise.all([
    Promise.all(balancesList.map(async (balanceContract) => {
      balances[balanceContract] = unscale(await token!.balanceOf(contractsMap[balanceContract]!.address), tokenInfo.decimals)
    })),
    Promise.all(approvalsList.map(async (approvalContract) => {
      const allowance = await token!.allowance(args.userAddress, contractsMap[approvalContract]!.address)
      approval[approvalContract] = {
        allowance: allowance.toString(),
        approving: false,
        approved: allowance.gt(bnf(uint255Max))
      }
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
