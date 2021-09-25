import { FunctionComponent, useEffect, useState } from 'react';
import { useAppSelector } from '../../app/hooks';
import { waitForProposals } from '../../slices/waitFor';
import AppLoading from '../library/AppLoading';
import { Proposal as IProposal, ProposalState } from '../../slices/proposals';
import Proposal from './Proposal';
import Center from '../library/Center';
import { ListItem, UnorderedList } from 'carbon-components-react';
import { AppTag } from '../library/AppTag';
import { useDispatch } from 'react-redux';

const defaultSelectedStates: {[key in ProposalState]: boolean} = {
  Pending: true,
  Active: true,
  Defeated: false,
  Succeeded: true,
  Queued: true,
  Executed: false,
  Canceled: false,
  Expired: false,
}

const ProposalsContainer: FunctionComponent = () => {
  const dispatch = useDispatch()
  const [ selectedStates, updateSelectedStates ] = useState<{[key in ProposalState]: boolean}>(defaultSelectedStates);
  const [ defaultSelected, updateDefaultSelected ] = useState<boolean>(true);
  const [ allSelected, updateAllSelected ] = useState<boolean>(false);
  const [ noneSelected, updateNoneSelected ] = useState<boolean>(false);

  const proposalsState = waitForProposals(useAppSelector, dispatch);
  const [ filteredProposals, updateFilteredProposals ] = useState<IProposal[]>([]);

  useEffect(() => {
    const proposals = proposalsState && Object.values(proposalsState);
    if (proposals && proposals.length) {
      updateFilteredProposals(proposals.filter(proposal => proposal.proposal && selectedStates[proposal.proposal.state as ProposalState]));
    }
  }, [selectedStates, proposalsState]);

  useEffect(() => {
    const numberOfTrueStates = Object.entries(selectedStates).filter(entry => entry[1]).length;
    const numberOfFalseStates = Object.entries(selectedStates).filter(entry => !entry[1]).length;
    if (!numberOfTrueStates) {
      // none
      updateAllSelected(false);
      updateNoneSelected(true);
      updateDefaultSelected(false);
    } else if (!numberOfFalseStates) {
      // all
      updateAllSelected(true);
      updateNoneSelected(false);
      updateDefaultSelected(false);
    } else {
      // default
      updateAllSelected(false);
      updateNoneSelected(false);
      updateDefaultSelected(true);
    }
  }, [selectedStates]);

  const setAll = (selected: boolean): void => {
    let newSelectedStates: {[key in ProposalState]: boolean} = { ...selectedStates };
    for (const label in selectedStates) {
      newSelectedStates[label as ProposalState] = selected;
    }
    updateSelectedStates(newSelectedStates);
  };

  const setDefault = (): void => {
    updateSelectedStates(defaultSelectedStates);
  };

  if (!proposalsState) {
    return (
      <AppLoading
        description="Proposals loading"
        small
        withOverlay={false}
      />
    );
  }

  if (proposalsState && !Object.values(proposalsState).length) {
    return (
      <Center> There are no governance proposals </Center>
    );
  }

  return (
    <>
      <ProposalsHeader
        allSelected={allSelected}
        defaultSelected={defaultSelected}
        noneSelected={noneSelected}
        proposalsShown={filteredProposals.length}
        proposalsTotal={(proposalsState && Object.values(proposalsState).length) || 0}
        setAll={setAll}
        setDefault={setDefault}
      />
      <ProposalsList filteredProposals={filteredProposals} />
    </>
  );
}

// TODO: Consider not making this a separate component as we pass just about everything down anyways
interface ProposalsHeaderProps {
  allSelected: boolean;
  defaultSelected: boolean;
  noneSelected: boolean;
  proposalsShown: number;
  proposalsTotal: number;
  setAll: (selected: boolean) => void;
  setDefault: () => void;
}

const ProposalsHeader: FunctionComponent<ProposalsHeaderProps> = ({
  allSelected,
  defaultSelected,
  noneSelected,
  proposalsShown,
  proposalsTotal,
  setDefault,
  setAll,
}) => {
  return (
    <>
      <div> Displaying {proposalsShown} of {proposalsTotal} </div>
      <div>
        <AppTag name="Default" color="blue" selected={defaultSelected} onClick={setDefault} />
        <AppTag name="All" color="blue" selected={allSelected} onClick={() => setAll(true)} />
        <AppTag name="None" color="blue" selected={noneSelected} onClick={() => setAll(false)} />
      </div>
    </>
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
