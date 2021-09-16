import React, { MouseEvent, useState } from 'react'
import { withRouter, useHistory } from 'react-router'
import { Button, Tag, ModalWrapper } from 'carbon-components-react';
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import { Copy16, Launch16 } from '@carbon/icons-react';
import Center from '../library/Center';
import NetworkIndicator from '../library/NetworkIndicator';
import {
  Modal,
} from 'carbon-components-react'
import { abbreviateAddress } from '../../utils/index';

export default ({open, onRequestClose}: {open: boolean, onRequestClose: () => void}) => {
  const address = selector(state => state.wallet.address)
  if (address === null) throw 'Address not found.'

  return (
    <Modal
      open={open}
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
          <Button renderIcon={Copy16} kind="ghost">Copy Address</Button>
          <Button renderIcon={Launch16} kind="ghost">View on Explorer</Button>
        </Center>
        <hr />
      </div>
    </Modal>
  )
}
