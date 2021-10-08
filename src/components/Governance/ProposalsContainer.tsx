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

// 3 ways to modify what proposals you see in the governance tab:

// Options filtering (None, All, Default)
// TODO: Type aka State filtering
// Sorting (by ID or State)

enum SortOption {
  IDDescending = 'IDDescending',
  IDAscending = 'IDAscending',
  StateDescending = 'StateDescending',
  StateAscending = 'StateAscending',
}

enum SortType {
  ID = 'ID',
  State = 'State',
}

const isIDSort = (option: SortOption): boolean => option === SortOption.IDDescending || option === SortOption.IDAscending;
const isStateSort = (option: SortOption): boolean => option === SortOption.StateDescending || option === SortOption.StateAscending;
const switchIDSort = (option: SortOption): SortOption => option === SortOption.IDDescending ? SortOption.IDAscending : SortOption.IDDescending;
const switchStateSort = (option: SortOption): SortOption => option === SortOption.StateDescending ? SortOption.StateAscending : SortOption.StateDescending;

const orderStates = (state: ProposalState): number => [
  ProposalState.Pending,
  ProposalState.Active,
  ProposalState.Defeated,
  ProposalState.Succeeded,
  ProposalState.Queued,
  ProposalState.Executed,
  ProposalState.Canceled,
  ProposalState.Expired,
].indexOf(state);

// TODO: update icon values for carbon and add icon as optional prop to AppTags
// const displaySortIcon = (option: SortOption): IconName => {
//   switch(option) {
//     case SortOption.IDDescending:
//       return 'sort-numerical-desc'
//     case SortOption.IDAscending:
//       return 'sort-numerical'
//     case SortOption.StateDescending:
//       return 'sort-desc'
//     case SortOption.StateAscending:
//       return 'sort-asc'
//   }
// }

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
  // options filtering
  const [ defaultSelected, updateDefaultSelected ] = useState<boolean>(true);
  const [ allSelected, updateAllSelected ] = useState<boolean>(false);
  const [ noneSelected, updateNoneSelected ] = useState<boolean>(false);
  // sorting
  const [ statusSortOption, updateStatusSortOption ] = useState<SortOption>(SortOption.IDDescending);

  const proposalsState = waitForProposals(useAppSelector, dispatch);
  const [ displayedProposals, updateDisplayedProposals ] = useState<IProposal[]>([]);

  useEffect(() => {
    const proposals = proposalsState && Object.values(proposalsState);
    if (proposals && proposals.length) {
      const filteredProposals = proposals.filter(proposal => proposal.proposal && selectedStates[proposal.proposal.state as ProposalState]);
      const sortedProposals = filteredProposals.sort((a, b) => {
        switch (statusSortOption) {
          case SortOption.IDDescending:
            return b.proposal.id - a.proposal.id;
          case SortOption.IDAscending:
            return a.proposal.id - b.proposal.id;
          case SortOption.StateDescending:
            return orderStates(a.proposal.state) - orderStates(b.proposal.state);
          case SortOption.StateAscending:
            return orderStates(b.proposal.state) - orderStates(a.proposal.state);
        }
      })
      updateDisplayedProposals(sortedProposals);
      sortedProposals.forEach(pro => console.log(pro.proposal.id));
    }
  }, [selectedStates, statusSortOption, proposalsState]);

  // options filtering
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

  // options filtering
  const setAll = (selected: boolean): void => {
    let newSelectedStates: {[key in ProposalState]: boolean} = { ...selectedStates };
    for (const label in selectedStates) {
      newSelectedStates[label as ProposalState] = selected;
    }
    updateSelectedStates(newSelectedStates);
  };

  // options filtering
  const setDefault = (): void => {
    updateSelectedStates(defaultSelectedStates);
  };

  // type filtering
  const toggleTag = (state: ProposalState): void => {
    const newselectedStates = {
      ...selectedStates,
      status: !selectedStates[state],
    };
    updateSelectedStates(newselectedStates);
  };

  // sorting
  const toggleSort = (sortType: SortType): void => {
    if (sortType === SortType.ID) {
      updateStatusSortOption(switchIDSort(statusSortOption));
    }
    if (sortType === SortType.State) {
      updateStatusSortOption(switchStateSort(statusSortOption));
    }
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
        proposalsShown={displayedProposals.length}
        proposalsTotal={(proposalsState && Object.values(proposalsState).length) || 0}
        setAll={setAll}
        setDefault={setDefault}
        statusSortOption={statusSortOption}
        toggleSort={toggleSort}
      />
      <ProposalsList displayedProposals={displayedProposals} />
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
  statusSortOption: SortOption;
  toggleSort: (sortType: SortType) => void;
}

const ProposalsHeader: FunctionComponent<ProposalsHeaderProps> = ({
  allSelected,
  defaultSelected,
  noneSelected,
  proposalsShown,
  proposalsTotal,
  setDefault,
  statusSortOption,
  setAll,
  toggleSort,
}) => {
  return (
    <>
      <div> Displaying {proposalsShown} of {proposalsTotal} </div>
      <div>
        <AppTag name="Default" color="blue" selected={defaultSelected} onClick={setDefault} />
        <AppTag name="All" color="blue" selected={allSelected} onClick={() => setAll(true)} />
        <AppTag name="None" color="blue" selected={noneSelected} onClick={() => setAll(false)} />
      </div>
      <div>
        <AppTag name="Sort By ID" selected={isIDSort(statusSortOption)} onClick={() => toggleSort(SortType.ID)} />
        <AppTag name="Sort By State" selected={isStateSort(statusSortOption)} onClick={() => toggleSort(SortType.State)} />
      </div>
    </>
  );
}

interface ProposalsListProps {
  displayedProposals: IProposal[] | null;
}

const ProposalsList: FunctionComponent<ProposalsListProps> = ({ displayedProposals }) => {
  if (displayedProposals && !displayedProposals.length) {
    return null;
  }

  return (
    <UnorderedList>
      {displayedProposals && displayedProposals.map(proposal =>
      <ListItem key={proposal.proposal.id}>
        <Proposal proposal={proposal} />
      </ListItem>
      )}
    </UnorderedList>
  );
}

export default ProposalsContainer;
