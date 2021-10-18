import { ProtocolContract } from '../../slices/contracts'
import { balanceInfo } from '../../slices/balances'
import { waitForHueBalance, waitForLendHueBalance, getContractWaitFunction } from '../../slices/waitFor'
import { approveHue } from '../../slices/balances/hueBalance'
import { approveLendHue } from '../../slices/balances/lendHueBalance'
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import { Button } from 'carbon-components-react'

type approvalLabels = {
  waiting: string,
  approving: string,
  approved: string,
}

const ApprovalButton = ({
  token,
  protocolContract,
  disabled,
  approvalLabels,
}: {
  token: ProtocolContract,
  protocolContract: ProtocolContract,
  disabled?: boolean,
  approvalLabels?: approvalLabels
}) => {
  const dispatch = useAppDispatch()

  let balanceInfo: balanceInfo | null
  let tokenAddress = getContractWaitFunction(token)(selector, dispatch)
  let contractAddress = getContractWaitFunction(protocolContract)(selector, dispatch)

  switch(token) {
    case ProtocolContract.Hue:
      balanceInfo = waitForHueBalance(selector, dispatch)
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
  if (
    balanceInfo === null ||
    balanceInfo.approval[protocolContract] === undefined ||
    contractAddress === null ||
    tokenAddress === null ||
    disabled
  ) return nullButton

  if (balanceInfo.approval[protocolContract] === undefined) {
    console.error('ApprovalButton: Unknown protocolContract for approval: ' + token + ':' + protocolContract)
    return nullButton
  }

  const approving = balanceInfo.approval[protocolContract]?.approving
  const approved = balanceInfo.approval[protocolContract]?.approved

  if (approving) return <Button disabled>{approvalLabels.approving}</Button>
  if (approved) return <Button disabled>{approvalLabels.approved}</Button>


  const execute = () => {
    switch(token) {
      case ProtocolContract.Hue:
        dispatch(approveHue({Hue: tokenAddress!, spender: protocolContract, spenderAddress: contractAddress! }))
        break

      case ProtocolContract.LendHue:
        dispatch(approveLendHue({LendHue: tokenAddress!, spender: protocolContract, spenderAddress: contractAddress! }))
        break

      default:
        throw new Error('ApprovalButton for unknown token ' + token)
    }
  }

  return <Button onClick={execute}>{approvalLabels.waiting}</Button>
}

export default ApprovalButton
