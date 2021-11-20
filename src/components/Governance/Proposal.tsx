import React, { FunctionComponent } from 'react';
import { Tile } from 'carbon-components-react';
import { Proposal as IProposal, ProposalState } from '../../slices/proposals';
import { AppTag } from '../library/AppTag';
import ProgressBar from '../library/ProgressBar';

interface ProposalProps {
  proposal: IProposal;
  quorum: number;
}

const ProposalDescription: FunctionComponent<{ipfsHash: string}> = ({ ipfsHash }) => {
  if (!ipfsHash) {
    return <span>Description TBD</span>
  }
  return <a
    href={`https://gateway.ipfs.io/ipfs/${ipfsHash}`}
    target="_blank"
    rel="noopener noreferrer"
  >Description</a>
};

const Proposal: FunctionComponent<ProposalProps> = ({ proposal, quorum }) => {
  const { proposal: p } = proposal;
  const totalVotes = p.forVotes + p.againstVotes;
  return (
    <Tile style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <span> Proposal {p.id}: <ProposalDescription ipfsHash={p.ipfsHash} />. {p.state} </span>
          <div style={{ display: 'inline' }}>
            <AppTag
              name={p.state}
              color={p.state === ProposalState.Active ? 'blue' : 'gray'}
              selected
            />
          </div>
        </div>
        <div style={{ width: '25%', display: 'flex', flexDirection: 'column' }}>
          <ProgressBar label="Sentiment" amount={p.forVotes} max={totalVotes} />
          <ProgressBar label="Quorum Progress" amount={p.forVotes} max={quorum} />
        </div>
    </Tile>
  );
}
  
export default Proposal;
