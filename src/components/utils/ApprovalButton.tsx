import { AsyncThunk, createSlice } from '@reduxjs/toolkit'
import { useState } from "react"
import { ReactNode } from "react";
import { Link } from 'carbon-components-react'
import { xor } from '../../utils'
import { ProtocolContract } from '../../slices/contracts'
import { balanceInfo } from '../../slices/balances/index';
import { waitForHueBalance, waitForLendHueBalance, getContractWaitFunction } from '../../slices/waitFor';
import { approveHue, hueApproveArgs } from '../../slices/balances/hueBalance'
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import { RootState, AppDispatch } from '../../app/store'
import { Button } from 'carbon-components-react'

import { Market } from '../../utils/typechain'

type approvalLabels = {
  waiting: string,
  approving: string,
  approved: string,
}

const ApprovalButton = ({
  token,
  protocolContract,
  approvalLabels,
}: {
  token: ProtocolContract,
  protocolContract: ProtocolContract,
  approvalLabels?: approvalLabels
}) => {
  const dispatch = useAppDispatch()

  let balanceInfo: balanceInfo | null
  let thunk: AsyncThunk<void, hueApproveArgs, {}> | undefined = undefined
  let tokenAddress = getContractWaitFunction(token)(selector, dispatch)
  let contractAddress = getContractWaitFunction(protocolContract)(selector, dispatch)

  switch(token) {
    case ProtocolContract.Hue:
      balanceInfo = waitForHueBalance(selector, dispatch)
      thunk = approveHue
      break

    case ProtocolContract.LendHue:
      balanceInfo = waitForLendHueBalance(selector, dispatch)
      break
    default:
      throw new Error('ApprovalButton for unknown token ' + token)
  }

  if (approvalLabels === undefined) {
    approvalLabels = {
      waiting: 'Approve ' + protocolContract,
      approving: 'Approving ' + protocolContract + '...',
      approved: 'Approved ' + protocolContract,
    }
  }

  const nullButton = <Button disabled>{approvalLabels.waiting}</Button>
  console.log({balanceInfo})
  if (
    balanceInfo === null ||
    balanceInfo.approval[protocolContract] === undefined ||
    thunk === undefined ||
    contractAddress === null ||
    tokenAddress === null
  ) return nullButton

  if (balanceInfo.approval[protocolContract] === undefined) {
    console.error('ApprovalButton: Unknown protocolContract for approval: ' + token + ':' + protocolContract)
    return nullButton
  }

  const approving = balanceInfo.approval[protocolContract]?.approving
  const approved = balanceInfo.approval[protocolContract]?.approved

  if (approving) return <Button>{approvalLabels.approving}</Button>
  if (approved) return <Button disabled>{approvalLabels.approved}</Button>


  const execute = () => {
    dispatch(thunk!({Hue: tokenAddress!, spender: protocolContract, spenderAddress: contractAddress! }))
  }


  return <Button onClick={execute}>{approvalLabels.waiting}</Button>
}

export default ApprovalButton
