import { DataTableSkeleton, Button } from 'carbon-components-react'
import AppTile from '../library/AppTile'
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import { editorOpened } from '../../slices/positionsEditor'
import { waitForLiquidityPositions, waitForPrices, waitForPoolsMetadata } from '../../slices/waitFor'
import Center from '../library/Center'
import SimpleTable, { TableHeaderOnly } from '../library/SimpleTable'
import RelativeLoading from '../library/RelativeLoading'
import { numDisplay } from '../../utils'
import ConnectWalletButton from '../utils/ConnectWalletButton';
import Text from '../utils/Text';
import { LiquidityPosition } from '../../slices/liquidityPositions'

const UpdateLiquidityPosition = ({ positionID }: { positionID: string }) => {
  const dispatch = useAppDispatch()

  return <>Update on position {positionID}</>
}

export default UpdateLiquidityPosition
