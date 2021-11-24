import { Checkbox, Modal, RadioButtonGroup, RadioButton, Tile, RadioButtonValue } from "carbon-components-react"
import { FunctionComponent, SyntheticEvent, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { Proposal, ProposalState } from "../../slices/proposals"
import { TransactionType } from "../../slices/transactions"
import { waitForContracts } from "../../slices/waitFor"
import { numDisplay } from "../../utils"
import ProgressBar from "../library/ProgressBar"
import CreateTransactionButton from "../utils/CreateTransactionButton"
import { InlineAppTag, ProposalDescription } from "./GovernanceSubcomponents"
import { SignatureInfo } from "./SignatureInfo"

enum VoteChoice {
  YES = "YES",
  NO = "NO",
  NULL = "NULL",
}

const getVoteChoice = (proposal: Proposal): VoteChoice => {
  if (proposal.receipt.hasVoted) {
    if (proposal.receipt.support) {
      return VoteChoice.YES
    } else {
      return VoteChoice.NO
    }
  }
  return VoteChoice.NULL
}

const getUserVoteStatusDisplay = (proposal: Proposal): string => {
  const { proposal: p } = proposal
  const { hasVoted } = proposal.receipt
  const hasNoVotingPower = proposal.votingPower === 0
  const proposalActive = p.state === ProposalState.Active

  if (hasVoted) {
    return 'You have already cast a vote.'
  }
  if (proposalActive) {
    if (hasNoVotingPower) {
      return 'You did not have any delegated votes when this proposal was introduced and therefore cannot vote.'
    } else {
      return `Your vote has a weight of ${numDisplay(proposal.votingPower)} CNP.`
    }
  }
  return 'You cannot vote as this proposal is not active.'
}

const getIsVotingDisabled = (proposal: Proposal): boolean => {
  const hasNoVotingPower = proposal.votingPower === 0
  const proposalActive = proposal.proposal.state === ProposalState.Active
  return proposal.receipt.hasVoted || !proposalActive || hasNoVotingPower
}

const ProposalVoteModalContent: FunctionComponent<{
  proposal: Proposal,
  quorum: number,
}> = ({ proposal, quorum }) => {
  const dispatch = useAppDispatch()
  const contracts = waitForContracts(useAppSelector, dispatch)

  const initialVoteChoice = getVoteChoice(proposal)
  const [ voteChoice, setVoteChoice ] = useState<VoteChoice>(initialVoteChoice)
  const [ showRaw, setShowRaw ] = useState<boolean>(false)

  const { proposal: p } = proposal
  const totalVotes = p.forVotes + p.againstVotes
  const voteForPercentage = Math.round(p.forVotes / totalVotes * 100) || 0
  const voteAgainstPercentage = Math.round(p.againstVotes / totalVotes * 100) || 0
  const quorumRounded = Math.round(quorum)
  const forVotesRounded = Math.round(p.forVotes);
  const againstVotesRounded = Math.round(p.againstVotes);
  const totalVotesRounded = Math.round(totalVotes);

  const handleVoteChange = (newSelection: RadioButtonValue): void => {
    setVoteChoice(newSelection as VoteChoice)
  }

  return (
    <div>
      <div style={{ marginTop: 16}}>
        <ProposalDescription ipfsHash={p.ipfsHash} fontSize={24} />
        <InlineAppTag proposalState={p.state} />
      </div>
      {/* TODO: Add ability to copy proposer's address */}
      <div style={{ marginTop: 16}}> Created by: {p.proposer}</div>
      <div style={{ fontSize: 18, marginTop: 16 }} > Operations: </div>
      <div style={{ marginTop: 16 }}>
        <Checkbox id={`${p.id}-checkbox`} labelText="Display Raw" onChange={() => setShowRaw(!showRaw)} />
      </div>
      <SignatureInfo proposal={proposal} showRaw={showRaw} />
      <div style={{ display: 'flex', marginTop: 16 }} >
        <Tile style={{ flex: '0 1 50%', marginRight: 8 }} light > 
          <span style={{ fontSize: 24 }}> Vote Status </span>
          <ProgressBar
            label={`For ${voteForPercentage}%`}
            amount={p.forVotes}
            max={totalVotes}
            rightLabel={`${forVotesRounded} / ${totalVotesRounded}`}
          />
          <ProgressBar
            label={`Against ${voteAgainstPercentage}%`}
            amount={p.againstVotes}
            max={totalVotes}
            rightLabel={`${againstVotesRounded} / ${totalVotesRounded}`}
          />
          <ProgressBar
            label={p.forVotes > quorum ? "Quorum Reached" : "Quorum Not Reached"}
            amount={p.forVotes}
            max={quorum}
            rightLabel={`${forVotesRounded} / ${quorumRounded}`}
          />
        </Tile>
        <Tile style={{ flex: '0 1 50%', marginLeft: 8 }} light >
          <span style={{ fontSize: 24 }}> Vote </span>
          <div>{getUserVoteStatusDisplay(proposal)}</div>
          <div style={{ margin: '16px 0', display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
            <RadioButtonGroup
              name="proposal-vote"
              legendText="Do you support this proposal?"
              onChange={handleVoteChange}
              valueSelected={voteChoice}
              disabled={getIsVotingDisabled(proposal)}
            >
              <RadioButton labelText="Yes" value={VoteChoice.YES} id="proposal-vote-yes" />
              <RadioButton labelText="No" value={VoteChoice.NO} id="proposal-vote-no" />
            </RadioButtonGroup>
            <CreateTransactionButton
              title="Cast Vote"
              disabled={getIsVotingDisabled(proposal) || voteChoice === VoteChoice.NULL}
              txArgs={{
                type: TransactionType.VoteProposal,
                TcpGovernorAlpha: contracts!.TcpGovernorAlpha,
                proposalID: p.id,
                support: voteChoice === VoteChoice.YES,
              }}
              style={{ marginTop: 8, width: '50%' }}
            />
          </div>
        </Tile>
      </div>
    </div>
  )

}

export const ProposalVoteModal: FunctionComponent<{
  proposal: Proposal,
  open: boolean,
  onRequestClose: (event: SyntheticEvent) => void,
  quorum: number,
}> = ({ proposal, open, onRequestClose, quorum }) => {
  
    if (!open) return null

    const { proposal: p } = proposal
  
    return (
      <Modal
        open={open}
        passiveModal
        size="lg"
        onRequestClose={onRequestClose}
        modalHeading={`Proposal ${p.id}`}
      >
        <ProposalVoteModalContent proposal={proposal} quorum={quorum} />
      </Modal>
    )
  }
