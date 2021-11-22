import { Checkbox, Modal, Tile } from "carbon-components-react"
import { FunctionComponent, SyntheticEvent, useState } from "react"
import { Proposal } from "../../slices/proposals"
import ProgressBar from "../library/ProgressBar"
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

const ProposalVoteModalContent: FunctionComponent<{
  proposal: Proposal,
}> = ({ proposal }) => {
  const initialVoteChoice = getVoteChoice(proposal)
  const [ voteChoice, setVoteChoice ] = useState<VoteChoice>(initialVoteChoice)
  const [ showRaw, setShowRaw ] = useState<boolean>(false)
  const { proposal: p } = proposal
  const totalVotes = p.forVotes + p.againstVotes
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
          {/* TODO: Add %s to labels, fix last progress bar */}
          <ProgressBar label="For" amount={p.forVotes} max={totalVotes} rightLabel={`${p.forVotes} / ${totalVotes}`} />
          <ProgressBar label="Against" amount={p.againstVotes} max={totalVotes} rightLabel={`${p.againstVotes} / ${totalVotes}`} />
          <ProgressBar label="Quorum Reached / Not Reached" amount={0} max={0} rightLabel="0 / 0" />
        </Tile>
        <Tile style={{ flex: '0 1 50%', marginLeft: 8 }} light >
          <span style={{ fontSize: 24 }}> Vote </span>
          {/* TODO: Populate this tile */}
        </Tile>
      </div>
    </div>
  )

}

export const ProposalVoteModal: FunctionComponent<{
  proposal: Proposal,
  open: boolean,
  onRequestClose: (event: SyntheticEvent) => void
}> = ({ open, onRequestClose, proposal }) => {
  
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
        <ProposalVoteModalContent proposal={proposal} />
      </Modal>
    )
  }