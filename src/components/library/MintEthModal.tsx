import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import {
  Modal, Button, Dropdown, OnChangeData,
  NumberInput, TextArea, Tile, TextInput,
} from 'carbon-components-react'
import { TransactionType, TransactionStatus } from '../../slices/transactions'
import { useState, ChangeEventHandler } from 'react'
import { onNumChange, unique, seconds, minutes, hours, days, weeks, years }  from '../../utils/'
import { increaseTime, mineBlocks }  from '../../utils/debugUtils'
import AppTile from '../library/AppTile'
import SpacedList from '../library/SpacedList'
import CreateTransactionButton from '../library/CreateTransactionButton'
import LargeText from '../library/LargeText'
import Text from '../library/Text'
import Center from '../library/Center'
import waitFor from '../../slices/waitFor'
import ProtocolContract from '../../slices/contracts/ProtocolContract'

enum TimeOption {
  seconds = 'seconds',
  minutes = 'minutes',
  hours = 'hours',
  days = 'days',
  weeks = 'weeks',
  years = 'years',
}

const MintEthModal = () => {
  const dispatch = useAppDispatch()

  const [ open, setOpen ] = useState(false)
  const [ amount, setAmount ] = useState(5)
  const [ tokens, setTokens ] = useState('')
  const [ approveAddress, setApproveAddress ] = useState('')
  const [ unapproveAddress, setUnapproveAddress ] = useState('')

  const {
    ethERC20Info,
    contracts,
  } = waitFor([
    'ethERC20Info',
    'contracts',
  ], selector, dispatch)

  const tokenList =
    unique(
      tokens.split(' ')
        .map(token => token.trim())
        .map(token => token.split(',').map(token => token.trim()))
        .flat()
        .filter(token => token.length === 42))

  const approveAddressDialog =
    <SpacedList spacing={20}>
      <SpacedList>
        <TextInput
          id="approve_address"
          invalidText="A valid value is required"
          labelText="Approve address for spending Eth Erc20"
          placeholder="0x1234567890123456789012345678901234567890"
          value={approveAddress}
          onChange={(e: any) => setApproveAddress(e.target.value)}
        />
        <CreateTransactionButton
          title='Confirm'
          key='approve_address_button'
          disabled={approveAddress.length !== 42 || amount === 0 || contracts === null}
          size='md'
          txArgs={{
            type: TransactionType.ApproveEthERC20Address,
            address: approveAddress,
            ethERC20: contracts === null ? '' : contracts[ProtocolContract.EthERC20]
          }}
        />
      </SpacedList>
      <SpacedList>
        <TextInput
          id="unapprove_address"
          invalidText="A valid value is required"
          labelText="Unapprove address for spending Eth Erc20"
          placeholder="0x1234567890123456789012345678901234567890"
          value={unapproveAddress}
          onChange={(e: any) => setUnapproveAddress(e.target.value)}
        />
        <CreateTransactionButton
          title='Confirm'
          key='unapprove_address_button'
          disabled={unapproveAddress.length !== 42 || amount === 0 || contracts === null}
          size='md'
          txArgs={{
            type: TransactionType.UnapproveEthERC20Address,
            address: approveAddress,
            ethERC20: contracts === null ? '' : contracts[ProtocolContract.EthERC20]
          }}
        />
      </SpacedList>
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
                  <Text monospace>
                    {token}
                  </Text>
                </div>
              )}
            </div>
            <CreateTransactionButton
              title='Confirm'
              key='mint_eth_erc20'
              disabled={tokenList.length === 0 || amount === 0 || contracts === null}
              size='md'
              txArgs={{
                type: TransactionType.MintEthERC20,
                amount,
                addresses: tokenList,
                ethERC20: contracts === null ? '' : contracts[ProtocolContract.EthERC20]
              }}
            />
            {
              ethERC20Info !== null && ethERC20Info.isAdmin
              ? approveAddressDialog
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
