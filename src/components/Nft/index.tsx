import MintNftDisplay from './MintNftDisplay'
import UserNftDisplay from './UserNftDisplay'
import OneColumnDisplay from '../library/OneColumnDisplay'
import SpacedList from '../library/SpacedList'

import waitFor from '../../slices/waitFor'
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import Center from '../library/Center'
import Text from '../library/Text'

const whitelisted = [
  '0xaC5e1ccc84169A5Aa4c386EAE98c7CA863FEE6Bf',
  '0xf59f82fe741b47E08507435eD684245083055e94',
]

const Nft = () => {
  const dispatch = useAppDispatch()

  const {
    userAddress,
  } = waitFor([
    'userAddress',
  ], selector, dispatch)


    return (
      userAddress !== null && whitelisted.includes(userAddress)
        ? <OneColumnDisplay loading={false}>
            <SpacedList>
              <MintNftDisplay />
              <UserNftDisplay />
            </SpacedList>
          </OneColumnDisplay>
        : <Center style={{marginTop: 80}}>
            <Text>
              Coming... Check back soon!
            </Text>
          </Center>
    )
}

export default Nft
