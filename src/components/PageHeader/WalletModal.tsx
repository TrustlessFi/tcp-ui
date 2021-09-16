import React, { MouseEvent, useState } from 'react'
import { withRouter, useHistory } from 'react-router'
import {
  Modal,
} from 'carbon-components-react'

export default ({open, onRequestClose}: {open: boolean, onRequestClose: () => void}) => {
  return (
    <Modal
      open={open}
      passiveModal
      size="xs"
      onRequestClose={onRequestClose}
      modalHeading="Add a custom domain"
      modalLabel="Account resources"
      primaryButtonText="Add"
      secondaryButtonText="Cancel">
      <p style={{ marginBottom: '1rem' }}>
        Custom domains direct requests for your apps in this Cloud Foundry
        organization to a URL that you own. A custom domain can be a shared
        domain, a shared subdomain, or a shared domain and host.
      </p>
    </Modal>
  )
}

      /*
      <TextInput
        data-modal-primary-focus
        id="text-input-1"
        labelText="Domain name"
        placeholder="e.g. github.com"
        style={{ marginBottom: '1rem' }}
      />
      <Select id="select-1" defaultValue="us-south" labelText="Region">
        <SelectItem value="us-south" text="US South" />
        <SelectItem value="us-east" text="US East" />
      </Select>
      <Dropdown
        id="drop"
        label="Dropdown"
        titleText="Dropdown"
        items={[
          { id: 'one', label: 'one', name: 'one' },
          { id: 'two', label: 'two', name: 'two' },
        ]}
      />
      <MultiSelect
        id="test"
        label="Multiselect"
        items={[
          {
            id: 'downshift-1-item-0',
            text: 'Option 1',
          },
          {
            id: 'downshift-1-item-1',
            text: 'Option 2',
          },
        ]}
        itemToString={(item) => (item ? item.text : '')}
      />
      */
