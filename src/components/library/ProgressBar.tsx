import React, { FunctionComponent } from 'react'

interface ProgressBarProps {
  label: string
  amount: number
  max: number
  rightLabel?: string
}

// Carbon doesn't have one of these yet AFAICT
const ProgressBar: FunctionComponent<ProgressBarProps> = ({ label, amount, max, rightLabel }) => {
  const ratio = Math.round(amount / max * 100)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '4px' }}>
      <label htmlFor={label} style={{ fontSize: 12 }}>
        {label}
        {rightLabel && <span style={{ fontSize: 12, display: 'inline', float: 'right' }}>{rightLabel}</span>}
      </label>
      <progress id={label} value={amount} max={max} style={{ width: '100%' }}> {ratio}% </progress>
    </div>
  )
}
  
export default ProgressBar
