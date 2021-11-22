import { CodeSnippet, Modal } from "carbon-components-react"
import { BigNumber, ethers } from "ethers";
import { FunctionComponent, SyntheticEvent, useState } from "react"
import { Proposal } from "../../slices/proposals"
import { SignatureInfo } from "./SignatureInfo";

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
  console.log(proposal)
  return <div>
    <SignatureInfo proposal={proposal} showRaw={showRaw} />
  </div>

};

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
        <div style={{ marginBottom: '12px' }}>
          <h1> Proposal Vote information goes here </h1>
          <ProposalVoteModalContent proposal={proposal} />
        </div>
      </Modal>
    )
  }