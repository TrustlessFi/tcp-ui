import { useAppDispatch } from '../../app/hooks'
import { clearTab } from '../../slices/tabs'
import Center from './Center'
import Text from '../library/Text'
import LargeText from '../library/LargeText'
import SpacedList from '../library/SpacedList'
import Lottie, { Options as LottieOptions } from 'react-lottie'
import AnimationLotties from './AnimationLotties'
import {
  Link,
} from 'carbon-components-react'

const AppErrorDisplay = () => {
  const dispatch = useAppDispatch()

  const lottieOptions: LottieOptions = {
    animationData: JSON.parse(AnimationLotties.ErrorPage),
    autoplay: true,
    loop: true,
  }

  const onClick = () => {
    dispatch(clearTab())
    window.location.href = window.location.origin
  }

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
              Something went wrong!
            </Center>
          </LargeText>
          <Text size={16}>
            <SpacedList spacing={20}>
              <Center>
                There was an error, but your assets are safe.
              </Center>
              <Center>
                The testnet will be upgraded and accessible again by September 7th.
              </Center>
            </SpacedList>
          </Text>
        </SpacedList>
        <Center>
          <Link onClick={onClick} style={{cursor: 'pointer'}}>
            <Text size={16}>
              Back to Trustless
            </Text>
          </Link>
        </Center>
      </SpacedList>
    </div>
  )
}

export default AppErrorDisplay
