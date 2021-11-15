import React, { FunctionComponent } from 'react';
import { Tile } from 'carbon-components-react';
import { Proposal as IProposal, ProposalState } from '../../slices/proposals';
import { AppTag } from '../library/AppTag';
import ProgressBar from '../library/ProgressBar';

interface ProposalProps {
  proposal: IProposal;
  quorum: number;
}

// TO DO: Add Description
const Proposal: FunctionComponent<ProposalProps> = ({ proposal, quorum }) => {
  const { proposal: p } = proposal;
  const { forVotes, againstVotes } = p;
  const totalVotes = forVotes + againstVotes;
  return (
    <Tile style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <span> Proposal {p.id}: -- Description TBD -- . {p.state} </span>
          <div style={{ display: 'inline' }}>
            <AppTag
              name={p.state}
              color={p.state === ProposalState.Active ? 'blue' : 'gray'}
              selected
            />
          </div>
        </div>
        <div style={{ width: '25%', display: 'flex', flexDirection: 'column' }}>
          <ProgressBar label="Sentiment" amount={forVotes} max={totalVotes} />
          <ProgressBar label="Quorum Progress" amount={forVotes} max={quorum} />
        </div>
    </Tile>
  );
}
  
export default Proposal;
