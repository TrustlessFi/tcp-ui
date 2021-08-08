import React, { FunctionComponent } from 'react';
import AppTile from '../library/AppTile';
import ProposalsContainer from './ProposalsContainer';
import VoteDelegationPanel from './VoteDelegationPanel';

const Governance: FunctionComponent = () => {
  return (
    <>
      <AppTile title="Proposals" className="proposals" >
        <ProposalsContainer />
      </AppTile>
      <AppTile title="Voting Power" className="voting-power" >
        <VoteDelegationPanel />
      </AppTile>
    </>
  );
}
  
export default Governance;
