import React, { FunctionComponent } from 'react';
import { Tile } from 'carbon-components-react';
import { Proposal as IProposal, ProposalState } from '../../slices/proposals';
import { AppTag } from '../library/AppTag';
import ProgressBar from '../library/ProgressBar';

interface ProposalProps {
  proposal: IProposal;
}

const Proposal: FunctionComponent<ProposalProps> = ({ proposal }) => {
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
        <div style={{ width: '25%' }}>
          <ProgressBar label="Sentiment" amount={forVotes} max={totalVotes} />
        </div>
    </Tile>
  );
}
  
export default Proposal;
