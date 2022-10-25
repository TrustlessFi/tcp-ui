import { useAppDispatch } from '../../app/hooks'
import { clearTab } from '../../slices/tabs'
import Center from './Center'
import Text from './Text'
import LargeText from './LargeText'
import SpacedList from './SpacedList'
import Lottie, { Options as LottieOptions } from 'react-lottie'
import AnimationLotties from './AnimationLotties'
import {
  Link,
} from 'carbon-components-react'

const TestnetClosedDisplay = () => {
  const dispatch = useAppDispatch()

  const lottieOptions: LottieOptions = {
    animationData: JSON.parse(AnimationLotties.ErrorPage),
    autoplay: true,
    loop: true,
  }

  const trustlessDiscord = 'https://trustless.fi/discord'

  return (
    <div style={{ marginTop: '20%', flexDirection: 'column' }}>
      <SpacedList spacing={40}>
        <Center>
          <Lottie
            options={lottieOptions}
            height={250}
            width={250}
          />
        </Center>
        <SpacedList spacing={20}>
          <LargeText size={36}>
            <Center>
              The demo is offline due to zkSync maintenance.
            </Center>
          </LargeText>
          <Text size={16}>
            <Center>
              Check back soon! Further information can be found in the Trustless Discord.
            </Center>
          </Text>
        </SpacedList>
        <Center>
          <Link href={trustlessDiscord} target='_blank' style={{cursor: 'pointer'}}>
            <Text size={16}>
              Trustless Discord
            </Text>
          </Link>
        </Center>
      </SpacedList>
    </div>
  )
}

export default TestnetClosedDisplay
