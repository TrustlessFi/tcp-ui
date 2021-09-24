import { useState } from "react"
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import { ReactNode } from "react";
import { ChainID } from '../../slices/chainID'
import Text from './Text'
import {
  Link,
} from 'carbon-components-react'
import { assertUnreachable } from '../../utils'

const LargeText = ({
  txHash,
  size,
  icon,
  children,
}: {
  txHash: string,
  size?: 'sm' | 'md' | 'lg',
  icon?: React.ComponentType,
  children: ReactNode
}) => {
  const chainID = selector(state => state.chainID.chainID)

  if (chainID === null) throw new Error('ExplorerLink: Chain ID Null')

  const [visited, setVisited] = useState(false)

  const getEtherscanLink = (txHash: string, chainID: ChainID) => {
    switch (chainID) {
      case ChainID.Hardhat:
        return 'https://etherscan.io/' + txHash
      case ChainID.Rinkeby:
        return 'https://rinkeby.etherscan.io/' + txHash
      default:
        assertUnreachable(chainID)
    }
  }
  const onClick = () => {
    setVisited(true)
    const etherscanLink = getEtherscanLink(txHash, chainID)
    window.open(etherscanLink, '_blank');
  }

  return (
    <Link onClick={onClick} visited={visited} renderIcon={icon} size={size} style={{cursor: 'pointer'}}>
      {children}
    </Link>
  )
}

export default LargeText
