import { FunctionComponent, useEffect, useState } from 'react';
import { useAppSelector } from '../../app/hooks';
import { waitForProposals } from '../../slices/waitFor';
import AppLoading from '../library/AppLoading';
import { Proposal as IProposal, ProposalState } from '../../slices/proposals';
import Proposal from './Proposal';
import Center from '../library/Center';
import { ListItem, UnorderedList } from 'carbon-components-react';
import { AppTag, IconMap } from '../library/AppTag';
import { useDispatch } from 'react-redux';

// 3 ways to modify what proposals you see in the governance tab:

// Options filtering (None, All, Default)
// Type aka State filtering
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

const stateList = [
  ProposalState.Pending,
  ProposalState.Active,
  ProposalState.Defeated,
  ProposalState.Succeeded,
  ProposalState.Queued,
  ProposalState.Executed,
  ProposalState.Canceled,
  ProposalState.Expired,
]

const orderStates = (state: ProposalState): number => stateList.indexOf(state);

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
  const [ selectedStates, setSelectedStates ] = useState<{[key in ProposalState]: boolean}>(defaultSelectedStates);
  // options filtering
  const [ defaultSelected, setDefaultSelected ] = useState<boolean>(true);
  const [ allSelected, setAllSelected ] = useState<boolean>(false);
  const [ noneSelected, setNoneSelected ] = useState<boolean>(false);
  // sorting
  const [ statusSortOption, setStatusSortOption ] = useState<SortOption>(SortOption.IDDescending);

  const proposalsState = waitForProposals(useAppSelector, dispatch);
  
  const [ quorum, setQuorum ] = useState<number>(0);
  const [ displayedProposals, setDisplayedProposals ] = useState<IProposal[]>([]);

  useEffect(() => {
    const quorum = proposalsState?.quorum;
    if (quorum) {
      setQuorum(quorum);
    }
  }, [proposalsState]);

  useEffect(() => {
    const proposals = proposalsState?.proposals && Object.values(proposalsState.proposals);
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
      setDisplayedProposals(sortedProposals);
    }
  }, [selectedStates, statusSortOption, proposalsState]);

  // options filtering
  useEffect(() => {
    const isNoneSelected = !Object.entries(selectedStates).filter(entry => entry[1]).length;
    const isAllSelected = !Object.entries(selectedStates).filter(entry => !entry[1]).length;
    const isDefaultSelected = Object.entries(selectedStates).every(entry => entry[1] === defaultSelectedStates[entry[0] as ProposalState]);
    if (isNoneSelected) {
      setAllSelected(false);
      setNoneSelected(true);
      setDefaultSelected(false);
    } else if (isAllSelected) {
      setAllSelected(true);
      setNoneSelected(false);
      setDefaultSelected(false);
    } else if (isDefaultSelected) {
      setAllSelected(false);
      setNoneSelected(false);
      setDefaultSelected(true);
    } else {
      // some other combination, due to tag filtering
      setAllSelected(false);
      setNoneSelected(false);
      setDefaultSelected(false);
    }
  }, [selectedStates]);

  // options filtering
  const setAll = (selected: boolean): void => {
    let newSelectedStates: {[key in ProposalState]: boolean} = { ...selectedStates };
    for (const label in selectedStates) {
      newSelectedStates[label as ProposalState] = selected;
    }
    setSelectedStates(newSelectedStates);
  };

  // options filtering
  const setDefault = (): void => {
    setSelectedStates(defaultSelectedStates);
  };

  // type filtering
  const toggleTag = (state: ProposalState): void => {
    const newselectedStates = {
      ...selectedStates,
      [state]: !selectedStates[state],
    };
    setSelectedStates(newselectedStates);
  };

  // sorting
  const toggleSort = (sortType: SortType): void => {
    if (sortType === SortType.ID) {
      setStatusSortOption(switchIDSort(statusSortOption));
    }
    if (sortType === SortType.State) {
      setStatusSortOption(switchStateSort(statusSortOption));
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

  const proposalsTotal = proposalsState?.proposals && Object.values(proposalsState.proposals).length || 0;

  if (proposalsTotal === 0) {
    return (
      <Center> There are no governance proposals at this time </Center>
    );
  }
  
  return (
    <>
      <ProposalsHeader
        allSelected={allSelected}
        defaultSelected={defaultSelected}
        noneSelected={noneSelected}
        proposalsShown={displayedProposals.length}
        proposalsTotal={proposalsTotal}
        setAll={setAll}
        setDefault={setDefault}
        selectedStates={selectedStates}
        statusSortOption={statusSortOption}
        toggleSort={toggleSort}
        toggleTag={toggleTag}
      />
      <ProposalsList displayedProposals={displayedProposals} quorum={quorum} proposalsTotal={proposalsTotal}/>
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
  selectedStates: {[key in ProposalState]: boolean};
  statusSortOption: SortOption;
  toggleSort: (sortType: SortType) => void;
  toggleTag: (state: ProposalState) => void;
}

const ProposalsHeader: FunctionComponent<ProposalsHeaderProps> = ({
  allSelected,
  defaultSelected,
  noneSelected,
  proposalsShown,
  proposalsTotal,
  setDefault,
  selectedStates,
  statusSortOption,
  setAll,
  toggleSort,
  toggleTag,
}) => {
  return (
    <>
      <div> Displaying {proposalsShown} of {proposalsTotal} </div>
      <div style={{display: 'flex', justifyContent: 'space-between'}}>
        <div>
          <AppTag name="Default" color="blue" selected={defaultSelected} onClick={setDefault} />
          <AppTag name="All" color="blue" selected={allSelected} onClick={() => setAll(true)} />
          <AppTag name="None" color="blue" selected={noneSelected} onClick={() => setAll(false)} />
        </div>
        <div>
          <AppTag
            name="Sort By ID"
            selected={isIDSort(statusSortOption)}
            onClick={() => toggleSort(SortType.ID)}
            icon={statusSortOption === SortOption.IDDescending ? IconMap.ArrowUp16 : IconMap.ArrowDown16}
          />
          <AppTag
            name="Sort By State"
            selected={isStateSort(statusSortOption)}
            onClick={() => toggleSort(SortType.State)}
            icon={statusSortOption === SortOption.StateAscending ? IconMap.ArrowUp16 : IconMap.ArrowDown16}
          />
        </div>
      </div>
      <div>
        {stateList.map((state) => {
          return (
            <AppTag
              name={state}
              key={state}
              selected={selectedStates[state]}
              onClick={() => toggleTag(state)}
            />
          );
        })}
      </div>
    </>
  );
}

interface ProposalsListProps {
  displayedProposals: IProposal[] | null;
  proposalsTotal: number;
  quorum: number;
}

const ProposalsList: FunctionComponent<ProposalsListProps> = ({ displayedProposals, proposalsTotal, quorum }) => {
  if (displayedProposals && !displayedProposals.length) {
    return <Center style={{ padding: '40px 0'}}> You have filtered out all {proposalsTotal} proposal(s). </Center>;
  }

  return (
    <UnorderedList>
      {displayedProposals && displayedProposals.map(proposal =>
      <ListItem key={proposal.proposal.id}>
        <Proposal proposal={proposal} quorum={quorum} />
      </ListItem>
      )}
    </UnorderedList>
  );
}

export default ProposalsContainer;
