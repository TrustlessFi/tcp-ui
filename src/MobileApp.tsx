import { FunctionComponent } from 'react'
import Center from './components/library/Center'
import SpacedList from './components/library/SpacedList'
import Text from './components/library/Text'
import LargeText from './components/library/LargeText'

const MobileApp: FunctionComponent<{}> = () => {
  return (
    <Center style={{margin: 40}}>
      <SpacedList spacing={40}>
        <LargeText>
          Sorry, Trustless does not yet support mobile.
        </LargeText>
        <Text>
          Please view on desktop.
        </Text>
      </SpacedList>
    </Center>
  )
}

export default MobileApp
