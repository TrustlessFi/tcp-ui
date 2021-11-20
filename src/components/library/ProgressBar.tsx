import React, { FunctionComponent } from 'react';

interface ProgressBarProps {
  label: string;
  amount: number;
  max: number;
}

// Carbon doesn't have one of these yet AFAICT
const ProgressBar: FunctionComponent<ProgressBarProps> = ({ label, amount, max }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '4px' }}>
      <label htmlFor={label} style={{ fontSize: 12 }} >{label}</label>
      <progress id={label} value={amount} max={max}> {amount}% </progress>
    </div>
  );
}
  
export default ProgressBar;
