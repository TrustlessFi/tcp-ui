import { BigNumber } from "ethers"
import { TcpGovernorAlpha } from '@trustlessfi/typechain'
import { unscale, zeroAddress } from "../../utils"
import { Proposal, ProposalState, proposalsInfo } from "./"
import { ProtocolContract } from '../contracts'
import getContract from '../../utils/getContract'
import { proposalsArgs } from '.'

const convertStateIDToState = (stateID: number) => {
  switch(stateID) {
    case 0:
      return ProposalState.Pending
    case 1:
      return ProposalState.Active
    case 2:
      return ProposalState.Canceled
    case 3:
      return ProposalState.Defeated
    case 4:
      return ProposalState.Succeeded
    case 5:
      return ProposalState.Queued
    case 6:
      return ProposalState.Expired
    case 7:
      return ProposalState.Executed
    default:
      throw new Error('stateID not recognized')
  }
}

interface RawProposal {
  proposal: {
    id: number
    proposer: string
    eta: number
    targets: string[]
    signatures: string[]
    calldatas: string[]
    startBlock: number
    endBlock: number
    forVotes: BigNumber
    againstVotes: BigNumber
    canceled: boolean
    executed: boolean
  },
  receipt: {
    hasVoted: boolean
    support: boolean
    votes: BigNumber
  },
  state: number
  voterAddress?: string
  votingPower: number
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

export const genProposals = async (args: proposalsArgs): Promise<proposalsInfo | null> => {
  const tcpGovernorAlpha = getContract(args.TcpGovernorAlpha, ProtocolContract.TcpGovernorAlpha) as TcpGovernorAlpha

  const rawProposalData = await (tcpGovernorAlpha as TcpGovernorAlpha).getAllProposals(args.userAddress)
  const haveUserAddress = args.userAddress !== zeroAddress

  let _proposals = rawProposalData._proposals
  let _states = rawProposalData._proposalStates
  let _receipts = rawProposalData._receipts

  let _votingPower = new Array(_proposals.length).fill(0)

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

  const proposals: Array<Proposal> = []
  for (let i = 0; i < _proposals.length; i++) {
    const rawProposal = {
      proposal: _proposals[i],
      state: _states[i],
      receipt: _receipts[i],
      voterAddress: haveUserAddress ? args.userAddress : undefined,
      votingPower: _votingPower[i],
    }
    proposals.push(rawProposalToProposal(rawProposal))
  }

  const returnProposals = {} as proposalsInfo
  for (let i = 0; i < proposals.length; i++) {
    const proposal = proposals[i]
    returnProposals[proposal.proposal.id] = proposal
  }

  return returnProposals
}
