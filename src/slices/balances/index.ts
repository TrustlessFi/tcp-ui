import { sliceState } from '../'
import { unscale, uint255Max, bnf } from '../../utils'
import erc20Artifact from '@trustlessfi/artifacts/dist/@openzeppelin/contracts/token/ERC20/ERC20.sol/ERC20.json'
import { ProtocolContract } from '../contracts'
import { getMulticallContract, contract } from '../../utils/getContract'
import { getMulticall, getDuplicateFuncMulticall, executeMulticalls, rc } from '@trustlessfi/multicall'

import { ThunkDispatch, AnyAction } from '@reduxjs/toolkit'
import getProvider from '../../utils/getProvider';
import { uint256Max } from '../../utils'
import {
  getTxInfo,
  TransactionStatus,
  TransactionType,
  transactionCreated,
  transactionSucceeded,
  transactionFailed
} from '../transactions'
import {
  addNotification,
} from '../notifications'

import { ERC20 } from '@trustlessfi/typechain'

export interface tokenInfo {
  address: string,
  name: string,
  symbol: string,
  decimals: number,
}

type balances = { [key in ProtocolContract]?: number }

export interface approval {
  allowance: string
  approving: boolean
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

export const approveToken = async (
  token: ERC20,
  spender: string,
  txType: TransactionType,
  userAddress: string,
  dispatch: ThunkDispatch<unknown, unknown, AnyAction>
) => {
    const provider = getProvider()
    const tx = await token.connect(provider.getSigner()).approve(spender, uint256Max)

    const txInfo = getTxInfo({
      hash: tx.hash,
      userAddress,
      nonce: tx.nonce,
      type: txType,
      status: TransactionStatus.Pending,
    })

    dispatch(transactionCreated(txInfo))

    const receipt = await provider.waitForTransaction(tx.hash)
    const succeeded = receipt.status === 1

    if (succeeded) {
      dispatch(addNotification({ ...txInfo, status: TransactionStatus.Success }))
      dispatch(transactionSucceeded(tx.hash))
    } else {
      dispatch(addNotification({ ...txInfo, status: TransactionStatus.Failure }))
      dispatch(transactionFailed(tx.hash))
    }
}

export const tokenBalanceThunk = async (
  args: balanceArgs,
  approvalsList: {contract: ProtocolContract, address: string}[],
  balancesList: {contract: ProtocolContract, address: string}[],
): Promise<balanceInfo> => {
  const token = contract(args.tokenAddress, erc20Artifact.abi)
  const multicall = getMulticallContract(args.TrustlessMulticall)

  const { basicInfo, approvals, balances, userBalance } = await executeMulticalls(
    multicall,
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
