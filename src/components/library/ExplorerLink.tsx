import { useAppSelector as selector } from '../../app/hooks'
import { CSSProperties, ReactNode } from 'react'
import { ChainID } from '@trustlessfi/addresses'
import { CarbonIconType } from '@carbon/icons-react'

import { xor } from '../../utils'
import SmallLink from '../library/SmallLink';


export const getEtherscanTxLink = (txHash: string, chainID: ChainID): string => {
  switch (chainID) {
    case ChainID.Hardhat:
      return `https://etherscan.io/tx/${txHash}`
    case ChainID.ZKSyncGoerli:
      return `https://scan-v2.zksync.dev/transactions/${txHash}`
  }
}

export const getEtherscanAddressLink = (address: string, chainID: ChainID): string => {
  switch (chainID) {
    case ChainID.Hardhat:
      return `https://etherscan.io/address/${address}`
    case ChainID.ZKSyncGoerli:
      return `https://scan-v2.zksync.dev/accounts/${address}`
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
  children: ReactNode,
}) => {
  const chainID = selector(state => state.chainID)

  if (chainID === null) {
    console.warn('ExplorerLink: Chain ID Null')
    return <></>
  }

  if (!xor(txHash !== undefined, address !== undefined)) {
    console.warn('ExplorerLink: Provide only one of address, txhash')
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
