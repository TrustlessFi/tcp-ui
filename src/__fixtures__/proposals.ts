import { Proposal, proposalsInfo, ProposalState } from "../slices/proposals";
import { timeS, hours, randomInRange, enforce } from '../utils'


const addresses = [
  '0x5aa3393e361c2eb342408559309b3e873cd876d6',
  '0x58418d6c83efab01ed78b0ac42e55af01ee77dba',
  '0x0f8176c597aa2136b54bca3f10e098c668fa2ccb',
  '0xfc6bc5d50912354e89bad4dabf053bca2d7cd817',
  '0x29867e46afaccea1b84a97e06332f46ce7685f13',
  '0x03f7724180AA6b939894B5Ca4314783B0b36b329',
  '0x08992fda30f56D6dE4DB639D78406F51d5a4Ca06',
  '0x0388cEDB736843401805ebbD4038374f9A1eb923',
  '0x817b40620a69e41a7d9d5422061511690c5edd5a',
]

type action = {
  target: string,
  signature: string,
  calldata: string,
}

const actions: action[] = [{
  target: '0x704F4bD54E04f94226B819F080d7f0B175A4b45d',
  signature: 'setTwapDuration(uint32)',
  calldata: '0x0000000001000'
},{
  target: '0x704F4bD54E04f94226B819F080d7f0B175A4b45d',
  signature: 'setInterestPortionToLenders(uint)',
  calldata: '0x0000000001000'
},{
  target: '0x1061D4292eF0E7AC3D4Df658a163F3985aB72f07',
  signature: 'setInterestRateStep(uint128)',
  calldata: '0x0000000001000'
},{
  target: '0x4CAfdD8dd3B0acf93D82f2DB273fB1Bf5B4EEfAD',
  signature: 'setTwapDuration(uint32)',
  calldata: '0x0000000001000'
}]

const getRandomAddress = () => addresses[randomInRange(0, addresses.length)]

const GRACE_PERIOD = hours(1)

const getProposal = (id: number, args: {
  blockTimestamp: number,
  blockNumber: number,
  percentageCompletion: number,
  hasVoted: boolean
  hasVotedFor: boolean
  canceled: boolean
  executed: boolean
}): Proposal => {
  args.percentageCompletion = Math.floor(args.percentageCompletion)
  enforce(0 <= args.percentageCompletion, 'Percentage must be above 0')
  enforce(!(args.canceled && args.executed), 'Cant be canceled and executed')

  const startBlock = args.blockNumber - args.percentageCompletion
  const endBlock = startBlock + 100

  const votingPower = randomInRange(0, 100)
  const forVotes = (args.hasVoted && args.hasVotedFor ? votingPower : 0) + randomInRange(0, 1000)
  const againstVotes = (args.hasVoted && !args.hasVotedFor ? votingPower : 0) + randomInRange(0, 1000)

  const actionCount = randomInRange(0, 3)

  const localActions: action[] = []
  for(let i = 0; i < actionCount; i++) localActions.push(actions[randomInRange(0, actions.length)])

  const proposal: Proposal = {
    proposal: {
      id,
      ipfsHash: 'QmXExS4BMc1YrH6iWERyryFcDWkvobxryXSwECLrcd7Y1H',
      proposer: getRandomAddress(),
      eta: timeS() + ((hours(2) * args.percentageCompletion) / 100),
      targets: actions.map(action => action.target),
      signatures: actions.map(action => action.signature),
      calldatas: actions.map(action => action.calldata),
      startBlock,
      endBlock,
      forVotes,
      againstVotes,
      canceled: args.canceled,
      executed: args.executed,
      state: ProposalState.Pending,
    },
    receipt: {
      hasVoted: args.hasVoted,
      support: args.hasVoted && args.hasVotedFor,
      votes: votingPower,
    },
    voterAddress: getRandomAddress(),
    votingPower,
    voting: false,
    voted: args.hasVoted,
  }

  if (proposal.proposal.canceled) {
    proposal.proposal.state = ProposalState.Canceled
  } else if (args.blockNumber <= proposal.proposal.startBlock) {
    proposal.proposal.state = ProposalState.Pending
  } else if (args.blockNumber <= proposal.proposal.endBlock) {
    proposal.proposal.state = ProposalState.Active
  } else if (proposal.proposal.forVotes <= proposal.proposal.againstVotes) {
    proposal.proposal.state = ProposalState.Defeated
  } else if (proposal.proposal.eta === 0) {
    proposal.proposal.state = ProposalState.Succeeded
  } else if (proposal.proposal.executed) {
    proposal.proposal.state = ProposalState.Executed
  } else if (args.blockTimestamp > proposal.proposal.eta + GRACE_PERIOD) {
    proposal.proposal.state = ProposalState.Expired
  } else {
    proposal.proposal.state = ProposalState.Queued
  }
  return proposal
}

const getProposalsFixture = (blockNumber: number, blockTimestamp: number): Proposal[] => [
  getProposal(1, {
    blockTimestamp,
    blockNumber,
    percentageCompletion: 205,
    hasVoted: true,
    hasVotedFor: true,
    canceled: false,
    executed: false,
  }),
  getProposal(2, {
    blockTimestamp,
    blockNumber,
    percentageCompletion: 160,
    hasVoted: false,
    hasVotedFor: false,
    canceled: false,
    executed: true,
  }),
  getProposal(3, {
    blockTimestamp,
    blockNumber,
    percentageCompletion: 120,
    hasVoted: false,
    hasVotedFor: false,
    canceled: false,
    executed: true,
  }),
  getProposal(4, {
    blockTimestamp,
    blockNumber,
    percentageCompletion: 80,
    hasVoted: true,
    hasVotedFor: true,
    canceled: false,
    executed: false,
  }),
  getProposal(5, {
    blockTimestamp,
    blockNumber,
    percentageCompletion: 10,
    hasVoted: true,
    hasVotedFor: true,
    canceled: false,
    executed: false,
  }),
]

export const getProposalsInfoFixture = (blockNumber: number, blockTimestamp: number): proposalsInfo => {
  const proposals = getProposalsFixture(blockNumber, blockTimestamp);
  return {
    quorum: 900,
    proposals,
  };
};
