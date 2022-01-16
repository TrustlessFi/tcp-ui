import { abbreviateAddress } from '../../utils'
import { Tag} from 'carbon-components-react'
import { getEtherscanAddressLink } from '../library/ExplorerLink';
import { BlockieOptions, create as createIdenticon } from 'ethereum-blockies';
import { CSSProperties } from 'react';

const WalletButton = ({
  address,
  chainID,
  style
}: {
  address: string,
  chainID: number,
  style: CSSProperties,
}) => {
  const seed = address.toLowerCase();
  const options: BlockieOptions = {seed, scale: 3};
  const identicon = createIdenticon(options).toDataURL();
  return (
    <Tag
      onClick={() => window.open(getEtherscanAddressLink(address, chainID), '_blank')}
      style={style}>
        <img src={identicon} alt={address} style={{borderRadius: "50%", marginRight: "4px", verticalAlign: "middle"}}/>
        <div style={{display: "inline", fontSize: "16px", fontWeight: 400, verticalAlign: "middle"}}>{abbreviateAddress(address)}</div>
    </Tag>
  )
}

export default WalletButton
