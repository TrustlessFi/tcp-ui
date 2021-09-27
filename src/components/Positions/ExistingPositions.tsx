import { DataTableSkeleton, Button } from 'carbon-components-react'
import AppTile from '../library/AppTile'
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import { editorOpened } from '../../slices/positionsEditor'
import { waitForPositions , waitForPrices } from '../../slices/waitFor'
import Center from '../library/Center'
import SimpleTable, { TableHeaderOnly } from '../library/SimpleTable'
import { numDisplay } from '../../utils'
import ConnectWalletButton from '../utils/ConnectWalletButton';

const ExistingPositionsTable = () => {
  const dispatch = useAppDispatch()

  const positions = waitForPositions(selector, dispatch)
  const priceInfo = waitForPrices(selector, dispatch)
  const userAddress = selector(state => state.wallet.address)

  const headers = ['Position ID', 'Debt', 'Collateral', 'Collateralization Ratio']

  if (userAddress === null) {
    return <>
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
    </>
  }

  if (positions === null || priceInfo === null) {
    return <DataTableSkeleton headers={headers.map(header => ({key: header}))} rowCount={3} />
  }

  if (Object.values(positions).length === 0) return <Center>You have no positions. Click New Position to create one.</Center>

  const rows = Object.values(positions).map(position => {
    const collateralization = (position.collateralCount * priceInfo.ethPrice) / position.debtCount
    return {
      key: position.id,
      data: {
        'Position ID': position.id,
        'Debt': numDisplay(position.debtCount, 2) + ' Hue',
        'Collateral': numDisplay(position.collateralCount, 2) + ' Eth',
        'Collateralization Ratio': numDisplay(collateralization * 100, 0) + '%',
        'Rewards': '~546 TCP',
        '': 'claim'
      },
      onClick: () => dispatch(editorOpened({
        positionID: position.id,
        creating: false,
      }))
    }
  })

  return <SimpleTable rows={rows} />
}

const ExistingPositions = () => {
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
    <AppTile title="Positions" rightElement={createPositionButton}>
      <ExistingPositionsTable />
    </AppTile>
  )
}

export default ExistingPositions
