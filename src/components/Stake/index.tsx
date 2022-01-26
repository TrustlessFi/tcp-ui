import { useState } from "react"
import Center from '../library/Center'
import LargeText from '../library/LargeText'
import SpacedList from '../library/SpacedList'
import { Button, Tile } from "carbon-components-react"
import Increase from './Increase'
import Decrease from './Decrease'

const Stake = () => {
  const [increaseStake, setIncreaseStake] = useState(true)

  return (
    <Center>
      <Tile style={{width: 596, padding: 48}}>
        <SpacedList spacing={32}>
        <Center>
          <LargeText size={40}>
            Trustless Vault
          </LargeText>
        </Center>
        <Center>
          <Button
            key='stake'
            size='sm'
            onClick={() => setIncreaseStake(true)}
            kind={increaseStake ? 'primary' : 'secondary'}>
            Stake
          </Button>
          <Button
            key='withdraw'
            size='sm'
            onClick={() => setIncreaseStake(false)}
            kind={increaseStake ? 'secondary' : 'primary'}>
            Withdraw
          </Button>
        </Center>
        {
          increaseStake
          ? <Increase />
          : <Decrease />
        }
        </SpacedList>
      </Tile>
    </Center>
  )
}

export default Stake
