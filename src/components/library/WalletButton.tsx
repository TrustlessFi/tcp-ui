import { useHistory, useLocation } from 'react-router-dom'
import { abbreviateAddress } from '../../utils'
import { Tag } from 'carbon-components-react'
import jazzicon from '@metamask/jazzicon'
import { CSSProperties } from 'react'

const WalletButton = ({
  address,
  style
}: {
  address: string,
  style: CSSProperties,
}) => {
  const history = useHistory()
  const location = useLocation()

  // Convert '0x...' (hexadecimal) wallet address string to an integer.
  const radix = 16
  const diameter = 24
  const identicon = jazzicon(diameter, parseInt(address.slice(2, 10), radix))

  const inTransactions = location.pathname.includes('transactions')

  return (
    <Tag
      onClick={inTransactions ? () => {} : () => history.push('/transactions')}
      style={{cursor: inTransactions ? 'default' : 'pointer', ...style}}>
      <div
        style={{display: 'inline-block', verticalAlign: 'middle', marginTop: 4, marginRight: 4}}
        dangerouslySetInnerHTML={{ __html: identicon.outerHTML }}
      />
      <div style={{display: 'inline', verticalAlign: 'middle', fontSize: 16, fontWeight: 400}}>
        {abbreviateAddress(address)}
      </div>
    </Tag>
  )
}

export default WalletButton
