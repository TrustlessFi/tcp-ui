import { useAppSelector as selector } from '../../app/hooks'
import { Copy16, Launch16 } from '@carbon/icons-react'
import Center from '../library/Center'
import SmallLink from '../library/SmallLink'
import NetworkIndicator from '../library/NetworkIndicator'
import ExplorerLink from '../utils/ExplorerLink'
import {
  Modal,
} from 'carbon-components-react'
import { abbreviateAddress } from '../../utils'
import RecentTransactions from './RecentTransactions'

const WalletModal = ({open, onRequestClose}: {open: boolean, onRequestClose: () => void}) => {
  const address = selector(state => state.wallet.address)

  if (!open) return null
  
  if (address === null) {
    console.error('WalletModal: Address not found.')
    return null
  }

  return (
    <Modal
      open
      passiveModal
      size="xs"
      onRequestClose={onRequestClose}
      modalHeading="Account"
      primaryButtonText="Add"
      secondaryButtonText="Cancel">
      <div style={{ marginBottom: '1rem' }}>
        <p>Connected with Metamask</p>
        <NetworkIndicator />
        <Center>
          <h2>{abbreviateAddress(address)}</h2>
        </Center>
        <Center>
          <SmallLink icon={Copy16} onClick={() => alert('copy address clicked')}>Copy Address</SmallLink>
          <ExplorerLink address={address} icon={Launch16}>View on Explorer</ExplorerLink>
        </Center>
        <hr />
        <RecentTransactions />
      </div>
    </Modal>
  )
}

export default WalletModal
