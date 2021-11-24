import { FunctionComponent, SyntheticEvent, useState } from 'react'
import { ClickableTile } from 'carbon-components-react'
import { Proposal as IProposal } from '../../slices/proposals'
import ProgressBar from '../library/ProgressBar'
import { ProposalVoteModal } from './ProposalVoteModal'
import { InlineAppTag, ProposalDescription } from './GovernanceSubcomponents'

interface ProposalProps {
  proposal: IProposal
  quorum: number
}

const Proposal: FunctionComponent<ProposalProps> = ({ proposal, quorum }) => {
  const [ isProposalVoteOpen, setIsProposalVoteOpen ] = useState<boolean>(false)
  const { proposal: p } = proposal
  const totalVotes = p.forVotes + p.againstVotes

  const closeModal = (e: SyntheticEvent) => {
    setIsProposalVoteOpen(false)
    e.stopPropagation()
  }

  return (
    <ClickableTile style={{ display: 'flex', justifyContent: 'space-between' }} onClick={() => setIsProposalVoteOpen(true)}>
      <ProposalVoteModal
        proposal={proposal}
        open={isProposalVoteOpen}
        onRequestClose={closeModal}
        quorum={quorum}
      />
      <div>
        <span> Proposal {p.id}: <ProposalDescription ipfsHash={p.ipfsHash} />. {p.state} </span>
        <InlineAppTag proposalState={p.state} />
      </div>
      <div style={{ width: '25%', display: 'flex', flexDirection: 'column' }}>
        <ProgressBar label="Sentiment" amount={p.forVotes} max={totalVotes} />
        <ProgressBar label="Quorum Progress" amount={p.forVotes} max={quorum} />
      </div>
    </ClickableTile>
  )
}
  
export default Proposal
