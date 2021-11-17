import { Button } from 'carbon-components-react'
import { useHistory } from 'react-router-dom'
import AppTile from '../library/AppTile'
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import { editorOpened } from '../../slices/positionsEditor'
import { waitForPositions , waitForPrices } from '../../slices/waitFor'
import Center from '../library/Center'
import SimpleTable, { TableHeaderOnly } from '../library/SimpleTable'
import RelativeLoading from '../library/RelativeLoading'
import { numDisplay } from '../../utils'
import ConnectWalletButton from '../utils/ConnectWalletButton'
import Text from '../utils/Text'

const ExistingPositionsTable = () => {
  const dispatch = useAppDispatch()
  const history = useHistory()

  const positions = waitForPositions(selector, dispatch)
  const priceInfo = waitForPrices(selector, dispatch)
  const userAddress = selector(state => state.wallet.address)

  if (positions === null || priceInfo === null || positions === null) {
    return (
      <div style={{position: 'relative'}}>
        <RelativeLoading show={userAddress !== null} />
        <TableHeaderOnly headers=
          {[
            'Position ID',
            'Debt',
            'Collateral',
            'Collateralization Ratio',
            'Rewards',
            '',
          ]}
        />
        <Center>
          <div style={{margin: 32}}>
            <ConnectWalletButton />
          </div>
        </Center>
      </div>
    )
  }

  if (Object.values(positions).length === 0) {
    return (
      <Center style={{padding: 24}}>
        <Text>
          You have no positions.
        </Text>
      </Center>
    )
  }

  const getOnRewardsClick = (positionID: number) => (e: any) => {
    alert('claim rewrads for position id ' + positionID  + ' clicked')
    console.log({e})
    e.stopPropagation()
  }

  const rows = Object.values(positions).map(position => {
    const collateralization = (position.collateralCount * priceInfo.ethPrice) / position.debtCount

    const rewardsButton = (
      <Button
        small
        disabled={position.approximateRewards === 0}
        onClick={getOnRewardsClick(position.id)}>
        Claim {numDisplay(position.approximateRewards)} TCP
      </Button>
    )

    return {
      key: position.id,
      data: {
        'Position ID': position.id,
        'Debt': numDisplay(position.debtCount, 2) + ' Hue',
        'Collateral': numDisplay(position.collateralCount, 2) + ' Eth',
        'Collateralization Ratio': numDisplay(collateralization * 100, 0) + '%',
        'Approximate Rewards': rewardsButton,
      },
      onClick: () => {
        dispatch(editorOpened({
          positionID: position.id,
          creating: false,
        }))
        history.push(`/positions/${position.id}`)
      }
    }
  })

  return <SimpleTable rows={rows} />
}

const ExistingPositions = () => {
  const dispatch = useAppDispatch()
  const history = useHistory()

  const createPositionButton =
    <Button
      size="small"
      onClick={() => {
        dispatch(editorOpened({
          positionID: 0,
          creating: true,
        }))
        history.push('/positions/new')
      }}
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
