import { DataTableSkeleton, Button } from 'carbon-components-react'
import AppTile from '../library/AppTile'
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import { editorOpened } from '../../slices/positionsEditor'
import { waitForLiquidityPositions, waitForPrices, waitForPoolMetadata } from '../../slices/waitFor'
import Center from '../library/Center'
import SimpleTable, { TableHeaderOnly } from '../library/SimpleTable'
import RelativeLoading from '../library/RelativeLoading'
import { numDisplay } from '../../utils'
import ConnectWalletButton from '../utils/ConnectWalletButton';
import Text from '../utils/Text';
import { LiquidityPosition } from '../../slices/liquidityPositions'

const CreateLiquidityPosition = ({ poolID }: { poolID: number }) => {
  const dispatch = useAppDispatch()

  return <>Create on pool {poolID}</>
}

export default CreateLiquidityPosition
