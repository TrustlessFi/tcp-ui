import { abbreviateAddress } from '../../utils'
import { getEtherscanAddressLink } from '../library/ExplorerLink'
import { Tag } from 'carbon-components-react'
import Jazzicon from 'jazzicon'
import { CSSProperties, useRef } from 'react'

const WalletButton = ({
  address,
  chainID,
  style
}: {
  address: string,
  chainID: number,
  style: CSSProperties,
}) => {
  const diameter = 24
  // Convert '0x...' (hexadecimal) wallet address string to an integer.
  const radix = 16
  const identifier = parseInt(address.slice(2, 10), radix)
  const identicon = Jazzicon(diameter, identifier)
  const ref = useRef<HTMLDivElement>(null)
  if (ref.current) {
    ref.current.innerHTML = ''
    ref.current.appendChild(identicon)
  }
  return (
    <Tag
      onClick={() => window.open(getEtherscanAddressLink(address, chainID), '_blank')}
      style={style}>
        <div ref={ref} style={{display: "inline-block", verticalAlign: "middle", marginTop: "4px", marginRight: "4px"}} />
        <div style={{display: "inline", verticalAlign: "middle", fontSize: "16px", fontWeight: 400}}>{abbreviateAddress(address)}</div>
    </Tag>
  )
}

export default WalletButton
