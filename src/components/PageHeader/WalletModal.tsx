import React, { MouseEvent, useState } from 'react'
import { withRouter, useHistory } from 'react-router'
import { Button, Link, Tag, ModalWrapper } from 'carbon-components-react'
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import { Copy16, Launch16 } from '@carbon/icons-react'
import Center from '../library/Center'
import SmallLink from '../library/SmallLink'
import NetworkIndicator from '../library/NetworkIndicator'
import {
  Modal,
} from 'carbon-components-react'
import { abbreviateAddress } from '../../utils/index'
import RecentTransactions from './RecentTransactions'

export default ({open, onRequestClose}: {open: boolean, onRequestClose: () => void}) => {
  const address = selector(state => state.wallet.address)
  if (!open) return null
  if (address === null) throw 'Address not found.'

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
          <SmallLink icon={Launch16} onClick={() => alert('View on explorer clicked')}>View on Explorer</SmallLink>
        </Center>
        <hr />
        <RecentTransactions />
      </div>
    </Modal>
  )
}