import { Tag, TagTypeName } from 'carbon-components-react';
import { useAppSelector as selector } from '../../app/hooks'
import { ChainID, chainIDToName } from '@trustlessfi/addresses'
import { CSSProperties } from 'react';


const getColor: {[key in ChainID]: TagTypeName} = {
  [ChainID.Hardhat]: 'magenta',
  [ChainID.Rinkeby]: 'teal',
}

const NetworkIndicator = ({style}: {style?: CSSProperties}) => {
  const chainID = selector(state => state.chainID.chainID)

  if (chainID === null) return <Tag type="gray" style={style}>Unknown Network</Tag>
  else return <Tag type={getColor[chainID]} style={style}>{chainIDToName(chainID)}</Tag>
}

export default NetworkIndicator
