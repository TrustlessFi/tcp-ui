import { useHistory, useLocation } from 'react-router-dom'
import { abbreviateAddress } from '../../utils'
import { Tag } from 'carbon-components-react'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
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

  const inTransactions = location.pathname.includes('transactions')

  return (
    <Tag
      onClick={inTransactions ? () => {} : () => history.push('/transactions')}
      style={{cursor: inTransactions ? 'default' : 'pointer', ...style}}>
      <Jazzicon diameter={24} seed={jsNumberForAddress(address)} paperStyles={{marginRight: '4px', verticalAlign: 'middle'}} />
      <div style={{display: 'inline', verticalAlign: 'middle', fontSize: 16, fontWeight: 400}}>
        {abbreviateAddress(address)}
      </div>
    </Tag>
  )
}

export default WalletButton
