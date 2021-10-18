import { approval } from '../../slices/balances'
import { Button } from 'carbon-components-react'

const GenericApprovalButton = ({
  approval,
  disabled,
  tokenSymbol,
  onApprove,
}: {
  token: string,
  approvee: string,
  approval: approval,
  disabled?: boolean,
  tokenSymbol: string,
  onApprove: () => void,
}) => {
  const approvalLabels = {
    waiting: 'Approve ' + tokenSymbol,
    approving: 'Approving ' + tokenSymbol + '...',
    approved: 'Approved ' + tokenSymbol,
  }

  const nullButton = <Button disabled>{approvalLabels.waiting}</Button>

  if (disabled === true) return nullButton

  if (approval.approving) return <Button disabled>{approvalLabels.approving}</Button>
  if (approval.approved) return <Button disabled>{approvalLabels.approved}</Button>

  return <Button onClick={onApprove}>{approvalLabels.waiting}</Button>
}

export default GenericApprovalButton
