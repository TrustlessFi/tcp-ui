import React, { FunctionComponent } from 'react';
import { Tile } from 'carbon-components-react';
import { Proposal as IProposal } from '../../slices/proposals';

interface ProposalProps {
  proposal: IProposal;
}

const Proposal: FunctionComponent<ProposalProps> = ({ proposal }) => {
  return (
    <Tile>
      Proposal Row. Status: {proposal.proposal.state}
    </Tile>
  );
}
  
export default Proposal;
