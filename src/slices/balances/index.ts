import { sliceState } from '../'
import { unscale, uint255Max, bnf } from '../../utils'
import { TrustlessMulticallViewOnly } from '../../utils/typechain/'
import erc20Artifact from '../../utils/artifacts/@openzeppelin/contracts/token/ERC20/ERC20.sol/ERC20.json'
import { ProtocolContract } from '../contracts'
import getContract, { contract } from '../../utils/getContract'
import { getMulticall, getDuplicateFuncMulticall, executeMulticalls, rc } from '@trustlessfi/multicall'

interface tokenInfo {
  address: string,
  name: string,
  symbol: string,
  decimals: number,
}

type balances = { [key in ProtocolContract]?: number }

export type approval = {
  allowance: string,
  approving: boolean,
  approved: boolean
}

type approvals = { [key in ProtocolContract]?: approval}

export interface balanceInfo {
  token: tokenInfo
  userBalance: number
  approval: approvals
  balances: balances
}

export interface balanceState extends sliceState<balanceInfo> {}

export interface balanceArgs {
  tokenAddress: string,
  userAddress: string,
  TrustlessMulticall: string,
}

export const tokenBalanceThunk = async (
  args: balanceArgs,
  approvalsList: {contract: ProtocolContract, address: string}[],
  balancesList: {contract: ProtocolContract, address: string}[],
): Promise<balanceInfo> => {
  const token = contract(args.tokenAddress, erc20Artifact.abi)
  const tcpMulticall = getContract(args.TrustlessMulticall, ProtocolContract.TrustlessMulticall, true) as unknown as TrustlessMulticallViewOnly

  const { basicInfo, approvals, balances, userBalance } = await executeMulticalls(
    tcpMulticall,
    {
      basicInfo: getMulticall(token, {
        name: rc.String,
        symbol: rc.String,
        decimals: rc.Number,
      }),
      userBalance: getMulticall(token,
        { balanceOf: rc.BigNumber },
        { balanceOf: [args.userAddress] }
      ),
      approvals: getDuplicateFuncMulticall(
        token,
        'allowance',
        rc.BigNumberToString,
        Object.fromEntries(approvalsList.map(item => [item.contract, [args.userAddress, item.address]]))
      ),
      balances: getDuplicateFuncMulticall(
        token,
        'balanceOf',
        rc.BigNumberUnscale,
        Object.fromEntries(balancesList.map(item => [item.contract, [item.address]]))
      )
    }
  )

  const approval: approvals = Object.fromEntries(Object.entries(approvals).map(([destAddress, allowance]) => {
    return [
      destAddress,
      {
        allowance,
        approving: false,
        approved: bnf(allowance).gt(uint255Max)
      }
    ]
  }))

  const tokenInfo = { ...basicInfo, address: token.address }

  return { token: tokenInfo, userBalance: unscale(userBalance.balanceOf, tokenInfo.decimals), approval, balances}
}
