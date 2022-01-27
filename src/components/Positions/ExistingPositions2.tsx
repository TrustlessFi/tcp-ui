import { Button, Tile } from 'carbon-components-react'
import { useHistory } from 'react-router-dom'
import { Row, Col } from 'react-flexbox-grid'
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import waitFor from '../../slices/waitFor'
import Center from '../library/Center'
import RelativeLoading from '../library/RelativeLoading'
import { numDisplay } from '../../utils'
import Text from '../library/Text'
import LargeText from '../library/LargeText'
import SpacedList from '../library/SpacedList'
import { getCollateralRatioColor } from './'

const PositionCard = ({
  positionID,
  debtCount,
  collateralCount,
  interestRate,
  collateralRatio,
  collateralRatioRequirement,
  approximateRewards
}: {
  positionID: number
  debtCount: number
  collateralCount: number
  interestRate: number
  collateralRatio: number
  collateralRatioRequirement: number
  approximateRewards: number
}) => {
  const history = useHistory()
  const margin = 32

  const collateralColor = getCollateralRatioColor(collateralRatio, collateralRatioRequirement)

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
          <LargeText color={collateralColor}>{numDisplay(collateralRatio * 100, 0)}%</LargeText>
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
    marketInfo,
    contracts,
  } = waitFor([
    'positions',
    'pricesInfo',
    'userAddress',
    'marketInfo',
    'contracts',
  ], selector, dispatch)

  const dataNull =
    positions === null ||
    pricesInfo === null ||
    userAddress === null ||
    marketInfo === null ||
    contracts === null

  return (
    <Center style={{position: 'relative'}}>
      <RelativeLoading show={dataNull && userAddress !== null} />
      <SpacedList spacing={64} style={{maxWidth: 1200, position: 'relative'}}>
        {
          positions !== null && Object.values(positions).length === 0 && userAddress !== null
          ? <LargeText>You have no positions.</LargeText>
          : null
        }
        <Center>
          <Button
            iconDescription='Create Position'
            onClick={() => history.push('/positions/new')}
            kind={'primary'}>
            <Text size={16}>Create Position</Text>
          </Button>
        </Center>
        {
          dataNull || Object.values(positions).length === 0
          ? null
          : <Row center="xs">
              {
                Object.values(positions).map(position => (
                  <Col>
                    <PositionCard
                      positionID={position.id}
                      debtCount={position.debtCount}
                      collateralCount={position.collateralCount}
                      interestRate={40}
                      collateralRatio={(position.collateralCount * pricesInfo.ethPrice) / position.debtCount}
                      collateralRatioRequirement={marketInfo.collateralizationRequirement}
                      approximateRewards={position.approximateRewards}
                    />
                  </Col>
                ))
              }
            </Row>
        }
      </SpacedList>
    </Center>
  )
}

export default ExistingPositions2
