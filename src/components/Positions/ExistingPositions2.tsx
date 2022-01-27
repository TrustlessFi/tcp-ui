import { Button, Tile } from 'carbon-components-react'
import { useHistory } from 'react-router-dom'
import AppTile from '../library/AppTile'
import { Row, Col } from 'react-flexbox-grid'
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import waitFor from '../../slices/waitFor'
import Center from '../library/Center'
import SimpleTable, { TableHeaderOnly } from '../library/SimpleTable'
import RelativeLoading from '../library/RelativeLoading'
import { numDisplay, sum } from '../../utils'
import ConnectWalletButton from '../library/ConnectWalletButton'
import Text from '../library/Text'
import LargeText from '../library/LargeText'
import SpacedList from '../library/SpacedList'
import { Add16 } from '@carbon/icons-react'

const PositionCard = ({
  positionID,
  debtCount,
  collateralCount,
  interestRate,
  collateralizationRatio,
  approximateRewards
}: {
  positionID: number
  debtCount: number
  collateralCount: number
  interestRate: number
  collateralizationRatio: number
  approximateRewards: number
}) => {
  const history = useHistory()
  const margin = 32

  return (
    <Tile
      key={positionID}
      style={{
        cursor: 'pointer',
        padding: 32,
        minWidth: 300,
        minHeight: 400,
        marginRight: margin / 2,
        marginLeft: margin / 2,
        marginBottom: margin,
        // display: 'inline-block'
      }}
      onClick={() => history.push(`/positions/${positionID}`)}>
      <SpacedList spacing={24} style={{textAlign: 'center'}}>
        <Text size={32} >Position {positionID}</Text>
        <Text>
          <SpacedList spacing={2}>
          <LargeText>{numDisplay(debtCount, 0)} Hue</LargeText>
          <>for</>
          <LargeText>{numDisplay(collateralCount, 2)} Eth</LargeText>
          </SpacedList>
        </Text>
        <SpacedList spacing={2}>
          <>Current Interest Rate:</>
          <LargeText>{numDisplay(interestRate, 0)}%</LargeText>
        </SpacedList>
        <SpacedList spacing={2}>
          <>Collateral Ratio:</>
          <LargeText>{numDisplay(collateralizationRatio * 100, 0)}%</LargeText>
        </SpacedList>
        <SpacedList spacing={2}>
          <>Approximate Rewards:</>
          <LargeText>{numDisplay(approximateRewards, 0)} Tcp</LargeText>
        </SpacedList>
      </SpacedList>
    </Tile>
  )
}

const ExistingPositions2 = () => {
  const dispatch = useAppDispatch()
  const history = useHistory()

  const {
    positions,
    pricesInfo,
    userAddress,
    contracts,
  } = waitFor([
    'positions',
    'pricesInfo',
    'userAddress',
    'contracts',
  ], selector, dispatch)

  if (positions === null || pricesInfo === null || userAddress === null || contracts === null) {
    return (
      <div style={{position: 'relative', width: 550, height: 550}}>
        <RelativeLoading show={userAddress !== null} />
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

  // TODO why is position type any??
  const positionCards = Object.values(positions).map(position => (
    <Col>
      <PositionCard
        positionID={position.id}
        debtCount={position.debtCount}
        collateralCount={position.collateralCount}
        interestRate={40}
        collateralizationRatio={(position.collateralCount * pricesInfo.ethPrice) / position.debtCount}
        approximateRewards={position.approximateRewards}
      />
    </Col>
  ))

  return (
    <Center>
      <SpacedList spacing={64} style={{maxWidth: 1200, position: 'relative'}}>
        <Center>
          <Button
            iconDescription='Create Position'
            onClick={() => history.push('/positions/new')}
            kind={'primary'}>
            <Text size={16}>Create Position</Text>
          </Button>
        </Center>
        <Row center="xs">
          {positionCards}
        </Row>
      </SpacedList>
    </Center>
  )
}

export default ExistingPositions2
