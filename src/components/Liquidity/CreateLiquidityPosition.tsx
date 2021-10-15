import { DataTableSkeleton, Button } from 'carbon-components-react'
import AppTile from '../library/AppTile'
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import { editorOpened } from '../../slices/positionsEditor'
import { waitForLiquidityPositions, waitForPrices, waitForPools } from '../../slices/waitFor'
import Center from '../library/Center'
import SimpleTable, { TableHeaderOnly } from '../library/SimpleTable'
import RelativeLoading from '../library/RelativeLoading'
import { numDisplay } from '../../utils'
import ConnectWalletButton from '../utils/ConnectWalletButton';
import Text from '../utils/Text';
import { LiquidityPosition } from '../../slices/liquidityPositions'

const LiquidityPositionsTable = () => {
  const dispatch = useAppDispatch()

  const pools = waitForPools(selector, dispatch)
  const liquidityPositions = waitForLiquidityPositions(selector, dispatch)
  const userAddress = selector(state => state.wallet.address)

  if (pools === null || liquidityPositions === null || userAddress === null) {
    return (
      <div style={{position: 'relative'}}>
        <RelativeLoading show={userAddress !== null} />
        <TableHeaderOnly row={{
          key: 'key',
          data: {
            'Position ID': '',
            'Debt': '',
            'Collateral': '',
            'Collateralization Ratio': '',
            'Rewards': '',
            '': ''
          },
        }} />
        <Center>
          <div style={{margin: 32}}>
            <ConnectWalletButton />
          </div>
        </Center>
      </div>
    )
  }

  if (Object.values(liquidityPositions).length === 0) {
    return (
      <Center style={{padding: 24}}>
        <Text>
          You have no positions.
        </Text>
      </Center>
    )
  }

  const rows = Object.values(liquidityPositions).map((position: LiquidityPosition) => (
    {
      key: position.id,
      data: {
        'Position ID': position.id,
        'Liquidity': position.liquidity,
        'Tick Lower': position.tickUpper,
        'Tick Upper': position.tickLower,
        'Rewards': '~546 TCP',
        '': 'claim'
      },
      onClick: () => dispatch(editorOpened({
        positionID: position.id,
        creating: false,
      }))
    }
  ))

  return <SimpleTable rows={rows} />
}

const LiquidityPositions = () => {
  const dispatch = useAppDispatch()
  const createPositionButton =
    <Button
      size="small"
      onClick={() => dispatch(editorOpened({
        positionID: 0,
        creating: true,
      }))}
     >
      New Position
    </Button>

  return (
    <AppTile title="Uniswap Reward Positions" rightElement={createPositionButton}>
      <LiquidityPositionsTable />
    </AppTile>
  )
}

export default LiquidityPositions
