import { FunctionComponent } from "react"
import { ProposalState } from "../../slices/proposals"
import { AppTag } from "../library/AppTag"

export const ProposalDescription: FunctionComponent<{
  ipfsHash: string,
  fontSize?: number,
}> = ({ ipfsHash, fontSize = 14 }) => {
  if (!ipfsHash) {
    return <span style={{ fontSize }}>Description TBD</span>
  }
  return <a
    href={`https://gateway.ipfs.io/ipfs/${ipfsHash}`}
    target="_blank"
    rel="noopener noreferrer"
    style={{ fontSize }}
  >Proposal Description</a>
}

export const InlineAppTag: FunctionComponent<{ proposalState: ProposalState }> = ({ proposalState }) => (
  <div style={{ display: 'inline' }}>
    <AppTag
      name={proposalState}
      color={proposalState === ProposalState.Active ? 'blue' : 'gray'}
      selected
    />
  </div>
)
