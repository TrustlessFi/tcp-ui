import MintNftDisplay from './MintNftDisplay'
import UserNftDisplay from './UserNftDisplay'
import OneColumnDisplay from '../library/OneColumnDisplay'
import SpacedList from '../library/SpacedList'

const Nft = () => {
    return (
      <OneColumnDisplay loading={false}>
        <SpacedList>
          <MintNftDisplay />
          <UserNftDisplay />
        </SpacedList>
      </OneColumnDisplay>
    )
}

export default Nft
