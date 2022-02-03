import { useState } from "react"
import Center from '../library/Center'
import LargeText from '../library/LargeText'
import SpacedList from '../library/SpacedList'
import { Button, Tile } from "carbon-components-react"
import IncreaseStake from './IncreaseStake'
import DecreaseStake from './DecreaseStake'

const Stake = () => {
  const [increaseStake, setIncreaseStake] = useState(true)

  return (
    <SpacedList spacing={64} style={{marginTop: 64}}>
      <Center>
        <LargeText size={40}>
          Hue Vault
        </LargeText>
      </Center>
      <Center>
        <Tile style={{width: 596, padding: 48}}>
          <SpacedList spacing={32}>
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
              ? <IncreaseStake />
              : <DecreaseStake />
            }
          </SpacedList>
        </Tile>
      </Center>
    </SpacedList>
  )
}

export default Stake
