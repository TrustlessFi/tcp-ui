import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
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
          <Center>
            <LargeText size={36}>
              Something went wrong!
          </LargeText>
          </Center>
          <Center>
            <Text size={16}>
              There was an error, but your assets are safe.
            </Text>
          </Center>
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
