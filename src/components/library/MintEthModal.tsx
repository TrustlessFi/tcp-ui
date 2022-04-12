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

  const [ approveAddress, setApproveAddress ] = useState('')
  const [ unapproveAddress, setUnapproveAddress ] = useState('')

  const [ addAuthAddress, setAddAuthAddress ] = useState('')
  const [ removeAuthAddress, setRemoveAuthAddress ] = useState('')

  const {
    truEthInfo,
    contracts,
    rootContracts,
  } = waitFor([
    'truEthInfo',
    'contracts',
    'rootContracts',
  ], selector, dispatch)

  if (truEthInfo === null || (!truEthInfo.isAdmin && !truEthInfo.isAuthorized)) {
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

  const addAuthDialog =
    <SpacedList spacing={20}>
      <SpacedList>
        <TextInput
          id="add_auth"
          invalidText="A valid value is required"
          labelText="Approve address for minting TruEth"
          placeholder="0x1234567890123456789012345678901234567890"
          value={addAuthAddress}
          onChange={(e: any) => setAddAuthAddress(e.target.value)}
        />
        <CreateTransactionButton
          title='Add Auth'
          key='add_auth_button'
          disabled={addAuthAddress.trim().length !== 42 || amount === 0 || contracts === null}
          size='md'
          txArgs={{
            type: TransactionType.AddMintTruEthAddressAuth,
            address: addAuthAddress.trim(),
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
          value={removeAuthAddress}
          onChange={(e: any) => setRemoveAuthAddress(e.target.value)}
        />
        <CreateTransactionButton
          title='Remove Auth'
          key='unapprove_address_button'
          disabled={removeAuthAddress.trim().length !== 42 || amount === 0 || contracts === null}
          size='md'
          txArgs={{
            type: TransactionType.RemoveMintTruEthAddressAuth,
            address: removeAuthAddress.trim(),
            truEth: contracts === null ? '' : contracts[ProtocolContract.TruEth]
          }}
        />
      </SpacedList>
    </SpacedList>

    /*
  const approveAddressDialog =
    <SpacedList spacing={20}>
      <SpacedList>
        <TextInput
          id="approve_address"
          invalidText="A valid value is required"
          labelText="Approve address for spending TruEth"
          placeholder="0x1234567890123456789012345678901234567890"
          value={approveAddress}
          onChange={(e: any) => setApproveAddress(e.target.value)}
        />
        <CreateTransactionButton
          title='Approve Address'
          key='approve_address_button'
          disabled={approveAddress.length !== 42 || amount === 0 || contracts === null}
          size='md'
          txArgs={{
            type: TransactionType.ApproveTruEthAddress,
            address: approveAddress,
            truEth: contracts === null ? '' : contracts[ProtocolContract.TruEth]
          }}
        />
      </SpacedList>
      <SpacedList>
        <TextInput
          id="unapprove_address"
          invalidText="A valid value is required"
          labelText="Unapprove address for spending TruEth"
          placeholder="0x1234567890123456789012345678901234567890"
          value={unapproveAddress}
          onChange={(e: any) => setUnapproveAddress(e.target.value)}
        />
        <CreateTransactionButton
          title='Unapprove Address'
          key='unapprove_address_button'
          disabled={unapproveAddress.length !== 42 || amount === 0 || contracts === null}
          size='md'
          txArgs={{
            type: TransactionType.UnapproveTruEthAddress,
            address: unapproveAddress,
            truEth: contracts === null ? '' : contracts[ProtocolContract.TruEth]
          }}
        />
      </SpacedList>
    </SpacedList>
    */

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
          title={truEthInfo.chainEthIsApproved ? 'Confirm' : 'Approve above first'}
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

    const approveChainEth =
      <SpacedList spacing={10}>
        Approve before minting above, you only need to do this once
        <CreateTransactionButton
          title='Approve Chain Eth'
          key='approve_chain_eth'
          disabled={contracts === null}
          size='md'
          txArgs={{
            type: TransactionType.ApproveChainEth,
            chainEth: rootContracts === null ? '' : rootContracts.chainEth,
            address: rootContracts === null ? '' : rootContracts.testnetMultiMint,
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
            {
              truEthInfo.chainEthIsApproved
              ? null
              : approveChainEth
            }
            {mintTokens}
            <hr />
            {
              truEthInfo !== null && truEthInfo.isAdmin
              ? <SpacedList spacing={40}>
                  {addAuthDialog}
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
