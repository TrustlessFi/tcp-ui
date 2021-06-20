import { sliceState } from '../'
import { ChainID } from '../chainID'

import { getProtocolContract, ProtocolContract } from '../../utils/protocolContracts'
import { unscale, uint255Max, bnf } from '../../utils'
import { Contract } from 'ethers'

import { ERC20 } from "../../utils/typechain/ERC20"

export interface balanceData {
  token: ERC20
  balance: number,
  approval: { [key in ProtocolContract]?: {
    allowance: number,
    approving: boolean,
    approved: boolean
  }}
}

export interface balanceState extends sliceState {
  data: balanceData | null
}

export interface fetchTokenBalanceArgs {
  chainID: ChainID,
  userAddress: string,
}

export const getTokenBalanceThunk = (token: ProtocolContract, approvalsList: ProtocolContract[]) =>
  async (args: fetchTokenBalanceArgs) => {
    const hue = await getProtocolContract(args.chainID, token) as unknown as ERC20 | null
    if (hue === null) return null

    const contracts = await Promise.all(
      approvalsList.map(async contract => (await getProtocolContract(args.chainID, contract)) as unknown as Contract | null))

    if (contracts.includes(null)) return null

    const balance = unscale(await hue.balanceOf(args.userAddress))
    const approvals = await Promise.all(approvalsList.map(async (_, idx) => {
      const allowance = await hue.allowance(args.userAddress, contracts[idx]!.address)
      return {
        allowance: unscale(allowance),
        approving: false,
        approved: allowance.gt(bnf(uint255Max))
      }
    }))

    let data: balanceData = { token: hue, balance, approval: {}}
    approvalsList.map((contract, idx) => { data.approval[contract] = approvals[idx] })

    return data;
  }
