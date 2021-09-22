import { sliceState } from '../'
import { unscale, uint255Max, bnf } from '../../utils'
import { ERC20 } from "../../utils/typechain/ERC20"
import erc20Artifact from '../../utils/artifacts/@openzeppelin/contracts/token/ERC20/ERC20.sol/ERC20.json'
import { ProtocolContract } from '../contracts'
import { contract } from '../../utils/getContract'
import { getMulticall, Converter, executeMulticalls, getMulticall2  } from '../../utils/Multicall/index';
import * as mc from '../../utils/Multicall/index'

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
  const token = contract<ERC20>(args.tokenAddress, erc20Artifact.abi)

  const approval: approval = {}
  const balances: balances = {}


    const result = getMulticall2(
      token,
      {
        name: Converter.String,
        // symbol: mc.String,
        decimals: Converter.Number,
      },
    ),



  /*
  const result = await executeMulticalls({
  // const { basicInfo } = await executeMulticalls({
    basicInfo: getMulticall(
      token,
      {
        name: Converter.String,
        // symbol: mc.String,
        decimals: Converter.Number,
      },
      {}
    ),
  */

    /*
    approvals: getDuplicateFuncMulticall(
      token,
      'allowance',
      mc.String,
      Object.fromEntries(approvalsList.map(item => [item, [item.address, args.userAddress]]))
    ),
    */
  })
  // const basicInfo = basicInfoMulticall.getResult()
  // const approvals = approvalsMulticall.getResult()


  const tokenInfo = { ...basicInfo, address: token.address }

  // TODO improve multicall
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
