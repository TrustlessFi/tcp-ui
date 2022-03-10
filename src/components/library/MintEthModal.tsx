import {
  Modal, Button, Dropdown, OnChangeData,
  NumberInput, TextArea, Tile,
} from 'carbon-components-react'
import { useState, ChangeEventHandler } from 'react'
import { onNumChange, unique, seconds, minutes, hours, days, weeks, years }  from '../../utils/'
import { increaseTime, mineBlocks }  from '../../utils/debugUtils'
import AppTile from '../library/AppTile'
import SpacedList from '../library/SpacedList'
import LargeText from '../library/LargeText'
import Text from '../library/Text'
import Center from '../library/Center'

enum TimeOption {
  seconds = 'seconds',
  minutes = 'minutes',
  hours = 'hours',
  days = 'days',
  weeks = 'weeks',
  years = 'years',
}

const MintEthModal = () => {
  const [ open, setOpen ] = useState(false)
  const [ amount, setAmount ] = useState(5)
  const [ tokens, setTokens ] = useState('')

  const tokenList =
    unique(
      tokens.split(' ')
        .map(token => token.trim())
        .map(token => token.split(',').map(token => token.trim()))
        .flat()
        .filter(token => token.length === 42))

  console.log({tokenList})


  console.log({tokens})

  const modal =
    <Modal
      passiveModal
      hasScrollingContent
      preventCloseOnClickOutside
      open={open}
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
