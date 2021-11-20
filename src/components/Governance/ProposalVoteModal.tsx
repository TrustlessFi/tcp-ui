import { Modal } from "carbon-components-react"
import { FunctionComponent, SyntheticEvent } from "react"
import { Proposal } from "../../slices/proposals"

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
        </div>
      </Modal>
    )
  }