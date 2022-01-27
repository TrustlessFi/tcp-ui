import { useHistory, useLocation } from 'react-router-dom'
import { abbreviateAddress } from '../../utils'
import { Tag } from 'carbon-components-react'
import jazzicon from '@metamask/jazzicon'
import { CSSProperties, useEffect, useRef, useState } from 'react'

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

  // Trigger an immediate rerender on this component so that useRef().current exists.
  const [shouldUpdate, setShouldUpdate] = useState(true)
  useEffect(() => {
    if (shouldUpdate) setShouldUpdate(false)
  }, [shouldUpdate])

  const ref = useRef<HTMLDivElement>(null)
  if (ref.current) {
    ref.current.innerHTML = ''
    ref.current.appendChild(identicon)
  }
  return (
    <Tag
      onClick={inTransactions ? () => {} : () => history.push('/transactions')}
      style={{cursor: inTransactions ? 'default' : 'pointer', ...style}}>
      <div
        ref={ref}
        style={{display: 'inline-block', verticalAlign: 'middle', marginTop: 4, marginRight: 4}}
      />
      <div style={{display: 'inline', verticalAlign: 'middle', fontSize: 16, fontWeight: 400}}>
        {abbreviateAddress(address)}
      </div>
    </Tag>
  )
}

export default WalletButton
