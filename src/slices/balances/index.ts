import { sliceState } from '../'
import { unscale, uint255Max, bnf } from '../../utils'
import { TcpMulticallViewOnly } from '../../utils/typechain/'
import erc20Artifact from '../../utils/artifacts/@openzeppelin/contracts/token/ERC20/ERC20.sol/ERC20.json'
import { ProtocolContract } from '../contracts'
import getContract, { contract } from '../../utils/getContract'
import { getMulticall, getDuplicateFuncMulticall, executeMulticalls, rc } from '../../utils/Multicall'

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
  TcpMulticall: string,
}

export const tokenBalanceThunk = async (
  args: balanceArgs,
  approvalsList: {contract: ProtocolContract, address: string}[],
  balancesList: {contract: ProtocolContract, address: string}[],
) => {
  const token = contract(args.tokenAddress, erc20Artifact.abi)
  const tcpMulticall = getContract(args.TcpMulticall, ProtocolContract.TcpMulticall, true) as unknown as TcpMulticallViewOnly

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
        Object.fromEntries(approvalsList.map(item => [item.address, [args.userAddress, item.address]]))
      ),
      balances: getDuplicateFuncMulticall(
        token,
        'balanceOf',
        rc.BigNumberUnscale,
        Object.fromEntries(balancesList.map(item => [item.address, [item.address]]))
      )
    }
  )

  const approval: approval = Object.fromEntries(Object.entries(approvals).map(([destAddress, allowance]) => {
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
