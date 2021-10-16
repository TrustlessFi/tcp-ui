import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import { editorOpened } from '../../slices/positionsEditor'
import { waitForPoolMetadata, waitForPoolTicks, waitForRewards } from '../../slices/waitFor'
import RelativeLoading from '../library/RelativeLoading'
import { numDisplay } from '../../utils'
import ConnectWalletButton from '../utils/ConnectWalletButton';
import Text from '../utils/Text';
import { LiquidityPosition } from '../../slices/liquidityPositions'

const CreateLiquidityPosition = ({ poolAddress }: { poolAddress: string }) => {
  const dispatch = useAppDispatch()

  const rewardsInfo = waitForRewards(selector, dispatch)
  const poolTicks = waitForPoolTicks(selector, dispatch)
  const poolMetadata = waitForPoolMetadata(selector, dispatch)

  return (
    <>
      <div>
        Create on pool {poolAddress}
      </div>
      <div>
        Create on pool {poolAddress}
      </div>
    </>
  )
}

export default CreateLiquidityPosition
