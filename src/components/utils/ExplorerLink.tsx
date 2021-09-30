import { useAppSelector as selector } from '../../app/hooks'
import React, { ReactNode } from "react";
import { ChainID } from '../../slices/chainID'
import { CarbonIconType } from '@carbon/icons-react'
import { assertUnreachable, xor } from '../../utils'
import SmallLink from '../library/SmallLink';


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
  icon,
  children,
}: {
  txHash?: string,
  address?: string,
  icon?: CarbonIconType,
  children: React.ReactChild
}) => {
  const chainID = selector(state => state.chainID.chainID)

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
    <SmallLink icon={icon} onClick={onClick}>
      {children}
    </SmallLink>
  )
}

export default ExplorerLink
