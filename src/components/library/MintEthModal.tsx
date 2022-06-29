import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import {
  Modal, Button,
  NumberInput, TextArea, Tile, TextInput,
} from 'carbon-components-react'
import { TransactionType } from '../../slices/transactions'
import { useState } from 'react'
import { onNumChange, unique }  from '../../utils/'
import SpacedList from '../library/SpacedList'
import LargeText from '../library/LargeText'
import CreateTransactionButton from '../library/CreateTransactionButton'
import Text from '../library/Text'
import waitFor from '../../slices/waitFor'
import ProtocolContract from '../../slices/contracts/ProtocolContract'

const MintEthModal = () => {
  const dispatch = useAppDispatch()

  const [ open, setOpen ] = useState(false)

  const [ amount, setAmount ] = useState(5)
  const [ tokens, setTokens ] = useState('')

  const [ addMintAuthAddress, setAddMintAuthAddress ] = useState('')
  const [ removeMintAuthAddress, setRemoveMintAuthAddress ] = useState('')

  const [ addAdminAddress, setAddAdminAddress ] = useState('')
  const [ removeAdminAddress, setRemoveAdminAddress ] = useState('')

  const {
    truEthInfo,
    contracts,
    rootContracts,
  } = waitFor([
    'truEthInfo',
    'contracts',
    'rootContracts',
  ], selector, dispatch)

  if (truEthInfo === null || (!truEthInfo.isAdmin && !truEthInfo.isMinter)) {
    return <></>
  }

  const tokenList =
    unique(
      tokens.split(' ')
        .map(token => token.trim())
        .map(token => token.split(',').map(token => token.trim()))
        .flat()
        .map(token => token.split('\n').map(token => token.trim()))
        .flat()
        .filter(token => token.length === 42))


  const addressFieldDisabled = (fieldValue: string) =>
    fieldValue.trim().length !== 42 || amount === 0 || contracts === null

  const addMintAuthDialog =
    <SpacedList spacing={20}>
      <SpacedList>
        <TextInput
          id="add_auth"
          invalidText="A valid value is required"
          labelText="Approve address for minting TruEth"
          placeholder="0x1234567890123456789012345678901234567890"
          value={addMintAuthAddress}
          onChange={(e: any) => setAddMintAuthAddress(e.target.value)}
        />
        <CreateTransactionButton
          title='Add Mint Auth'
          key='add_auth_button'
          disabled={addressFieldDisabled(addMintAuthAddress)}
          size='md'
          txArgs={{
            type: TransactionType.AddMintTruEthAuth,
            address: addMintAuthAddress.trim(),
            truEth: contracts === null ? '' : contracts[ProtocolContract.TruEth]
          }}
        />
      </SpacedList>
      <SpacedList>
        <TextInput
          id="remove_auth"
          invalidText="A valid value is required"
          labelText="Unapprove address for minting TruEth"
          placeholder="0x1234567890123456789012345678901234567890"
          value={removeMintAuthAddress}
          onChange={(e: any) => setRemoveMintAuthAddress(e.target.value)}
        />
        <CreateTransactionButton
          title='Remove Mint Auth'
          key='unapprove_address_button'
          disabled={addressFieldDisabled(removeMintAuthAddress)}
          size='md'
          txArgs={{
            type: TransactionType.RemoveMintTruEthAuth,
            address: removeMintAuthAddress.trim(),
            truEth: contracts === null ? '' : contracts[ProtocolContract.TruEth]
          }}
        />
      </SpacedList>
    </SpacedList>

  const addAdminDialog =
    <SpacedList spacing={20}>
      <SpacedList>
        <TextInput
          id="add_admin"
          invalidText="A valid value is required"
          labelText="Add admin for minting TruEth"
          placeholder="0x1234567890123456789012345678901234567890"
          value={addAdminAddress}
          onChange={(e: any) => setAddAdminAddress(e.target.value)}
        />
        <CreateTransactionButton
          title='Add Admin'
          key='add_admin_button'
          disabled={addressFieldDisabled(addAdminAddress)}
          size='md'
          txArgs={{
            type: TransactionType.AddMintTruEthAdmin,
            address: addAdminAddress.trim(),
            truEth: contracts === null ? '' : contracts[ProtocolContract.TruEth]
          }}
        />
      </SpacedList>
      <SpacedList>
        <TextInput
          id="remove_admin"
          invalidText="A valid value is required"
          labelText="Remove admin for minting TruEth"
          placeholder="0x1234567890123456789012345678901234567890"
          value={removeAdminAddress}
          onChange={(e: any) => setRemoveAdminAddress(e.target.value)}
        />
        <CreateTransactionButton
          title='Remove Admin'
          key='remove_admin_button'
          disabled={removeAdminAddress.trim().length !== 42 || amount === 0 || contracts === null}
          size='md'
          txArgs={{
            type: TransactionType.RemoveMintTruEthAdmin,
            address: removeAdminAddress.trim(),
            truEth: contracts === null ? '' : contracts[ProtocolContract.TruEth]
          }}
        />
      </SpacedList>
    </SpacedList>

    const mintTokens =
      <SpacedList spacing={10}>
        <NumberInput
          hideSteppers
          id='token_count'
          label="Token count"
          min={0}
          step={1}
          onChange={onNumChange((value: number) => setAmount(value))}
          value={amount}
        />
        <TextArea
          id="address_list"
          invalidText="A valid value is required"
          labelText="Comma or space separated list of addresses"
          placeholder="0x1234567890123456789012345678901234567890 0x1234567890123456789012345678901234567890"
          value={tokens}
          onChange={(e: any) => setTokens(e.target.value)}
        />
        <div>
          {tokenList.map(token =>
            <div>
              <Text monospace key={token}>
                {token}
              </Text>
            </div>
          )}
        </div>
        <LargeText>
          {tokenList.length} Addresses
        </LargeText>
        <CreateTransactionButton
          title='Confirm'
          key='mint_eth_erc20'
          disabled={tokenList.length === 0 || amount === 0 || contracts === null}
          size='md'
          txArgs={{
            type: TransactionType.TestnetMultiMint,
            testnetMultiMint: rootContracts === null ? '' : rootContracts.testnetMultiMint,
            chainEth: rootContracts === null ? '' : rootContracts.chainEth,
            chainEthCount: 1e-5,
            truEthCount: amount,
            addresses: tokenList,
          }}
        />
      </SpacedList>

  const modal =
    <Modal
      passiveModal
      hasScrollingContent
      preventCloseOnClickOutside
      open={open}
      modalAriaLabel="tokens modal"
      onRequestClose={() => setOpen(false)}
      secondaryButtonText='Cancel'>
      <SpacedList spacing={32}>
        <Tile>
          <SpacedList spacing={40}>
            {mintTokens}
            <hr />
            {
              truEthInfo !== null && truEthInfo.isAdmin
              ? <SpacedList spacing={40}>
                  {addMintAuthDialog}
                  {addAdminDialog}
                </SpacedList>
              : null
            }
          </SpacedList>
        </Tile>
      </SpacedList>
    </Modal>

  return (
    <>
      {modal}
      <Button
        kind='ghost'
        onClick={() => setOpen(!open)}
        size='sm'>
        Mint Eth
      </Button>
    </>
  )
}

export default MintEthModal
