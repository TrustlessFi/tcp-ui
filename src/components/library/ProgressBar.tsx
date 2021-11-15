import React, { FunctionComponent } from 'react';
import { Tile } from 'carbon-components-react';
import { Proposal as IProposal, ProposalState } from '../../slices/proposals';
import { AppTag } from '../library/AppTag';

interface ProgressBarProps {
  label: string;
  amount: number;
  max: number;
}

const ProgressBar: FunctionComponent<ProgressBarProps> = ({ label, amount, max }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <label htmlFor={label} style={{ fontSize: 12 }} >{label}</label>
      <progress id={label} value={amount} max={max}> {amount}% </progress>
    </div>
  );
}
  
export default ProgressBar;
