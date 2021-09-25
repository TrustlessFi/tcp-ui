import { useState } from "react"
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import { ReactNode } from "react";
import { ChainID } from '../../slices/chainID'
import Text from './Text'
import {
  Link,
} from 'carbon-components-react'
import { assertUnreachable, xor } from '../../utils'


const getEtherscanTxLink = (txHash: string, chainID: ChainID) => {
  switch (chainID) {
    case ChainID.Hardhat:
      return 'https://etherscan.io/' + txHash
    case ChainID.Rinkeby:
      return 'https://rinkeby.etherscan.io/' + txHash
    default:
      assertUnreachable(chainID)
  }
}

const getEtherscanAddressLink = (address: string, chainID: ChainID) => {
  switch (chainID) {
    case ChainID.Hardhat:
      return 'https://etherscan.io/address/' + address
    case ChainID.Rinkeby:
      return 'https://rinkeby.etherscan.io/address' + address
    default:
      assertUnreachable(chainID)
  }
}

const ExplorerLink = ({
  txHash,
  address,
  size,
  icon,
  children,
}: {
  txHash?: string,
  address?: string,
  size?: 'sm' | 'md' | 'lg',
  icon?: React.ComponentType,
  children: ReactNode
}) => {
  const chainID = selector(state => state.chainID.chainID)
  const [visited, setVisited] = useState(false)

  if (chainID === null) {
    console.error('ExplorerLink: Chain ID Null')
    return <></>
  }
  if (!xor(txHash !== undefined, address !== undefined)) {
    console.error('ExplorerLink: Provide only one of address, txhash')
  }

  const etherscanLink = txHash !== undefined
    ? getEtherscanTxLink(txHash, chainID)
    : getEtherscanAddressLink(address!, chainID)


  const onClick = (e: any) => {
    e.preventDefault()
    setVisited(true)
    window.open(etherscanLink, '_blank');
  }

  return (
    <Link
      onClick={onClick}
      href={etherscanLink}
      target='_blank'
      visited={visited}
      renderIcon={icon}
      size={size}
      style={{cursor: 'pointer'}}
    >
      {children}
    </Link>
  )
}

export default ExplorerLink
