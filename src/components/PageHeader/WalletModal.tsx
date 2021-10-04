import { useAppSelector as selector } from '../../app/hooks'
import { Copy16, Launch16, Checkmark16 } from '@carbon/icons-react'
import Center from '../library/Center'
import SmallLink from '../library/SmallLink'
import NetworkIndicator from '../library/NetworkIndicator'
import ExplorerLink from '../utils/ExplorerLink'
import CopyToClipboard from 'react-copy-to-clipboard'
import {
  Modal,
} from 'carbon-components-react'
import { abbreviateAddress } from '../../utils'
import RecentTransactions from './RecentTransactions'
import Text from '../utils/Text';
import { useState } from "react";
import LargeText from '../utils/LargeText';

const WalletModal = ({open, onRequestClose}: {open: boolean, onRequestClose: () => void}) => {
  const address = selector(state => state.wallet.address)
  const [ isCopied, setIsCopied ] = useState(false)

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
        <Text>Connected with Metamask</Text>
        <NetworkIndicator style={{marginLeft: '8px' }} />
        <div />
        <LargeText>{abbreviateAddress(address)}</LargeText>
        <div style={{marginBottom: 16}} />
        <CopyToClipboard text={address} onCopy={() => setIsCopied(true)}>
          <SmallLink icon={isCopied ? Checkmark16 : Copy16}>Copy Address</SmallLink>
        </CopyToClipboard>
        <ExplorerLink address={address} icon={Launch16}>View on Explorer</ExplorerLink>
        <hr />
        <RecentTransactions />
      </div>
    </Modal>
  )
}

export default WalletModal
