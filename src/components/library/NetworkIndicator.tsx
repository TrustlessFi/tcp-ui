import { Tag } from 'carbon-components-react';
import { useAppSelector as selector } from '../../app/hooks'
import { chainIDToName, ChainID } from '../../slices/chainID'

const NetworkIndicator = () => {
  const chainID = selector(state => state.chainID.chainID)

  switch(chainID) {
    case ChainID.Hardhat:
      return <Tag type="magenta">{chainIDToName(chainID)}</Tag>
    case ChainID.Rinkeby:
      return <Tag type="teal">{chainIDToName(chainID)}</Tag>
    default:
      return <Tag type="gray">Unknown Network</Tag>
  }
}

export default NetworkIndicator
