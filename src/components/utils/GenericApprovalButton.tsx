import { approval } from '../../slices/balances'
import { CSSProperties } from "react";
import { Button } from 'carbon-components-react'

const GenericApprovalButton = ({
  approval,
  disabled,
  tokenSymbol,
  onApprove,
  style,
}: {
  approval: approval,
  disabled?: boolean,
  tokenSymbol: string,
  onApprove: () => void,
  style?: CSSProperties,
}) => {
  const waitingLabel = 'Approve ' + tokenSymbol
  const approvingLabel = 'Approving ' + tokenSymbol + '...'
  const approvedLabel = 'Approved ' + tokenSymbol

  if (disabled === true) return <Button disabled style={style}>{waitingLabel}</Button>
  if (approval.approving) return <Button disabled style={style}>{approvingLabel}</Button>
  if (approval.approved) return <Button disabled style={style}>{approvedLabel}</Button>

  return <Button onClick={onApprove} style={style}>{waitingLabel}</Button>
}

export default GenericApprovalButton
