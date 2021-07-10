import { BigNumber } from "ethers";
import getProvider from '../../utils/getProvider'
import { ChainID } from '../chainID';
import { ProtocolContract, getProtocolContract } from '../../utils/protocolContracts';
import { TCPGovernorAlpha } from "../../utils/typechain";
import { unscale, zeroAddress } from "../../utils";

type Proposals = {
  [key in number]: Proposal;
};

export enum ProposalStates {
  Pending = 'Pending',
  Active = 'Active',
  Canceled = 'Canceled',
  Defeated = 'Defeated',
  Succeeded = 'Succeeded',
  Queued = 'Queued',
  Expired = 'Expired',
  Executed = 'Executed',
}

const convertStateIDToState = (stateID: number) => {
  switch(stateID) {
    case 0:
      return ProposalStates.Pending;
    case 1:
      return ProposalStates.Active;
    case 2:
      return ProposalStates.Canceled;
    case 3:
      return ProposalStates.Defeated;
    case 4:
      return ProposalStates.Succeeded;
    case 5:
      return ProposalStates.Queued;
    case 6:
      return ProposalStates.Expired;
    case 7:
      return ProposalStates.Executed;
    default:
      // ??
  }
}

interface RawProposal {
  proposal: {
    id: number;
    proposer: string;
    eta: number;
    targets: string[];
    signatures: string[];
    calldatas: string[];
    startBlock: number;
    endBlock: number;
    forVotes: BigNumber;
    againstVotes: BigNumber;
    canceled: boolean;
    executed: boolean;
  },
  receipt: {
    hasVoted: boolean;
    support: boolean;
    votes: BigNumber;
  },
  state: number;
  voterAddress?: string;
  votingPower: number;
}
  
export interface Proposal {
  proposal: {
    id: number;
    proposer: string;
    eta: number;
    targets: string[];
    signatures: string[];
    calldatas: string[];
    startBlock: number;
    endBlock: number;
    forVotes: number;
    againstVotes: number;
    canceled: boolean;
    executed: boolean;
    state: ProposalStates | undefined;
  },
  receipt: {
    hasVoted: boolean;
    support: boolean;
    votes: number;
  },
  voterAddress?: string;
  votingPower: number;
  voting: boolean;
  voted: boolean;
}

const rawProposalToProposal = (rawProposal: RawProposal): Proposal => ({
  proposal: {
    id: rawProposal.proposal.id,
    proposer: rawProposal.proposal.proposer,
    eta: rawProposal.proposal.eta,
    targets: rawProposal.proposal.targets,
    signatures: rawProposal.proposal.signatures,
    calldatas: rawProposal.proposal.calldatas,
    startBlock: rawProposal.proposal.startBlock,
    endBlock: rawProposal.proposal.endBlock,
    forVotes: unscale(rawProposal.proposal.forVotes),
    againstVotes: unscale(rawProposal.proposal.againstVotes),
    canceled: rawProposal.proposal.canceled,
    executed: rawProposal.proposal.executed,
    state: convertStateIDToState(rawProposal.state),
  },
  receipt: {
    hasVoted: rawProposal.receipt.hasVoted,
    support: rawProposal.receipt.support,
    votes: unscale(rawProposal.receipt.votes),
  },
  voting: false,
  voted: false,
  votingPower: rawProposal.votingPower,
  voterAddress: rawProposal.voterAddress,
})

export const genProposals = async (chainID: ChainID): Promise<{proposals: Proposals} | null> => {
  const provider = getProvider();
  if (provider === null) return null;
  const [userAddress, tcpGovernorAlpha] = await Promise.all([
    provider.getSigner().getAddress(),
    getProtocolContract(chainID, ProtocolContract.TCPGovernorAlpha),
  ]).then(promises => promises);
  const rawProposalData = await (tcpGovernorAlpha as TCPGovernorAlpha).getAllProposals(userAddress);
  const haveUserAddress = userAddress !== zeroAddress;
  
  let _proposals = rawProposalData._proposals;
  let _states = rawProposalData._proposalStates;
  let _receipts = rawProposalData._receipts;

  let _votingPower = new Array(_proposals.length).fill(0);
  
  // This needs to be added once we have CNP, for now copied our old code

  /* if (haveUserAddress) {
    const cnp = await getProtocolContract('cnp') as CNP
    _votingPower = await Promise.all(_proposals.map(async (_proposal, index) => {
      // can't vote anyways if the proposal is in pending state
      if (_states[index] === 0) return 0

      let votingPower = await cnp.getPriorVotes(userAddress, _proposal.startBlock)
      return unscale(votingPower)
    }))
  }
  */ 

  const proposals: Array<Proposal> = [];
  for (let i = 0; i < _proposals.length; i++) {
    const rawProposal = {
      proposal: _proposals[i],
      state: _states[i],
      receipt: _receipts[i],
      voterAddress: haveUserAddress ? userAddress : undefined,
      votingPower: _votingPower[i],
    }
    proposals.push(rawProposalToProposal(rawProposal));
  }
  
  const returnProposals = {} as Proposals;
  for (let i = 0; i < proposals.length; i++) {
    const proposal = proposals[i];
    returnProposals[proposal.proposal.id] = proposal;
  }

  return {
    proposals: returnProposals,
  }
};