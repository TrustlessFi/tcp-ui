import React, { FunctionComponent } from 'react';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../app/hooks';
import { waitForProposals } from '../../slices/waitFor';
import AppLoading from '../library/AppLoading';
import { Proposal as IProposal } from '../../slices/proposals';
import Proposal from './Proposal';
import Center from '../library/Center';
import { ListItem, UnorderedList } from 'carbon-components-react';

const ProposalsContainer: FunctionComponent = () => {
  const dispatch = useDispatch();
  const proposalsState = waitForProposals(useAppSelector, dispatch);
  const proposals: IProposal[] | null = proposalsState && Object.values(proposalsState) || null;

  // optionsTags, typeTags, sortTags, filteredProposals state will live here
  // update handlers will live here
  // pass in tags + handlers to ProposalsHeader
  // pass in tags + filteredProposals to ProposalsList

  if (!proposalsState) {
    return (
      <AppLoading
        description="Proposals loading"
        small
        withOverlay={false}
      />
    );
  }

  if (proposals && !proposals.length) {
    return (
      <Center> There are no proposals </Center>
    );
  }

  return (
    <>
      <ProposalsHeader />
      <ProposalsList filteredProposals={[]} />
    </>
  );
}

// interface ProposalsHeaderProps {
//   proposals: proposalsInfo | null;
// }

const ProposalsHeader: FunctionComponent = () => {
  return (
    <div> Displaying x of x </div>
  );
}

interface ProposalsListProps {
  filteredProposals: IProposal[] | null;
}

const ProposalsList: FunctionComponent<ProposalsListProps> = ({ filteredProposals }) => {
  if (filteredProposals && !filteredProposals.length) {
    return null;
  }
  
  return (
    <UnorderedList>
      {filteredProposals && filteredProposals.map(proposal => 
      <ListItem key={proposal.proposal.id}>
        <Proposal proposal={proposal} />
      </ListItem>
      )}
    </UnorderedList>
  );
}
  
export default ProposalsContainer;
