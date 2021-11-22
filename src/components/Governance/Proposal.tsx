import { FunctionComponent, SyntheticEvent, useState } from 'react'
import { ClickableTile } from 'carbon-components-react'
import { Proposal as IProposal, ProposalState } from '../../slices/proposals'
import { AppTag } from '../library/AppTag'
import ProgressBar from '../library/ProgressBar'
import { ProposalVoteModal } from './ProposalVoteModal'

interface ProposalProps {
  proposal: IProposal
  quorum: number
}

const ProposalDescription: FunctionComponent<{ ipfsHash: string }> = ({ ipfsHash }) => {
  if (!ipfsHash) {
    return <span>Description TBD</span>
  }
  return <a
    href={`https://gateway.ipfs.io/ipfs/${ipfsHash}`}
    target="_blank"
    rel="noopener noreferrer"
  >Proposal Description</a>
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
      <ProposalVoteModal open={isProposalVoteOpen} onRequestClose={closeModal} proposal={proposal} />
      <div>
        <span> Proposal {p.id}: <ProposalDescription ipfsHash={p.ipfsHash} />. {p.state} </span>
        <div style={{ display: 'inline' }}>
          <AppTag
            name={p.state}
            color={p.state === ProposalState.Active ? 'blue' : 'gray'}
            selected
          />
        </div>
      </div>
      <div style={{ width: '25%', display: 'flex', flexDirection: 'column' }}>
        <ProgressBar label="Sentiment" amount={p.forVotes} max={totalVotes} />
        <ProgressBar label="Quorum Progress" amount={p.forVotes} max={quorum} />
      </div>
    </ClickableTile>
  )
}
  
export default Proposal
