import { Proposal, ProposalStates } from "../slices/proposals";

export const proposal1: Proposal = {
  proposal: {
    id: 123,
    proposer: 'John Doe',
    eta: 100,
    targets: ['target1, target2, target3'],
    signatures: ['sig1, sig2, sig3'],
    calldatas: ['calldate1, calldate2, calldate3'],
    startBlock: 1,
    endBlock: 2,
    forVotes: 400,
    againstVotes: 300,
    canceled: false,
    executed: false,
    state: ProposalStates.Active,
  },
  receipt: {
    hasVoted: true,
    support: false,
    votes: 314,
  },
  voterAddress: 'address1',
  votingPower: 100,
  voting: false,
  voted: false,
};

export const proposal2: Proposal = {
  proposal: {
    id: 456,
    proposer: 'Jane Doe',
    eta: 200,
    targets: ['target4, target5, target6'],
    signatures: ['sig4, sig5, sig6'],
    calldatas: ['calldate4, calldate5, calldate6'],
    startBlock: 3,
    endBlock: 4,
    forVotes: 300,
    againstVotes: 400,
    canceled: true,
    executed: false,
    state: ProposalStates.Canceled,
  },
  receipt: {
    hasVoted: false,
    support: false,
    votes: 3140,
  },
  voterAddress: 'address2',
  votingPower: 200,
  voting: false,
  voted: false,
};

export const proposal3: Proposal = {
  proposal: {
    id: 789,
    proposer: 'Jane Doe',
    eta: 300,
    targets: ['target7, target8, target9'],
    signatures: ['sig7, sig8, sig9'],
    calldatas: ['calldate7, calldate8, calldate9'],
    startBlock: 5,
    endBlock: 6,
    forVotes: 3000,
    againstVotes: 410,
    canceled: false,
    executed: true,
    state: ProposalStates.Executed,
  },
  receipt: {
    hasVoted: true,
    support: true,
    votes: 31400,
  },
  voterAddress: 'address3',
  votingPower: 300,
  voting: false,
  voted: true,
};

export const proposalsInfoFixture = {
  1: proposal1,
  2: proposal2,
  3: proposal3,
}
