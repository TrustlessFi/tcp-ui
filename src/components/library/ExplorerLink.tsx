import { useAppSelector as selector } from '../../app/hooks'
import { CSSProperties } from 'react';
import { ChainID } from '@trustlessfi/addresses'
import { assertUnreachable } from '@trustlessfi/utils'
import { CarbonIconType } from '@carbon/icons-react'

import { xor } from '../../utils'
import SmallLink from '../library/SmallLink';


export const getEtherscanTxLink = (txHash: string, chainID: ChainID) => {
  switch (chainID) {
    case ChainID.Rinkeby:
      return 'https://rinkeby.etherscan.io/tx/' + txHash
    case ChainID.Hardhat:
      return 'https://etherscan.io/tx/' + txHash
    default:
      assertUnreachable(chainID)
  }
}

export const getEtherscanAddressLink = (address: string, chainID: ChainID) => {
  switch (chainID) {
    case ChainID.Rinkeby:
      return 'https://rinkeby.etherscan.io/address/' + address
    case ChainID.Hardhat:
      return 'https://etherscan.io/address/' + address
    default:
      assertUnreachable(chainID)
  }
}

const ExplorerLink = ({
  txHash,
  address,
  icon,
  style,
  children,
}: {
  txHash?: string,
  address?: string,
  icon?: CarbonIconType,
  style?: CSSProperties,
  children: React.ReactChild
}) => {
  const chainID = selector(state => state.chainID)

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

  const onClick = () => window.open(etherscanLink, '_blank');

  return (
    <SmallLink icon={icon} onClick={onClick} style={style}>
      {children}
    </SmallLink>
  )
}

export default ExplorerLink
