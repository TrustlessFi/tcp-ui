import { Button } from 'carbon-components-react'
import { useHistory } from 'react-router-dom'
import AppTile from '../library/AppTile'
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import { clearPoolCurrentData } from '../../slices/poolCurrentData'
import { waitForLiquidityPositions, waitForPoolsMetadata } from '../../slices/waitFor'
import { LiquidityPosition } from '../../slices/liquidityPositions'
import { bnf } from '../../utils/'
import Bold from '../utils/Bold'
import LargeText from '../utils/LargeText'
import { poolMetadata } from '../../slices/poolsMetadata'
import Center from '../library/Center'
import SimpleTable, { TableHeaderOnly } from '../library/SimpleTable'
import RelativeLoading from '../library/RelativeLoading'
import ConnectWalletButton from '../utils/ConnectWalletButton'

const LiquidityPositionsTable = (
  {
    pool,
    liquidityPositions,
  }: {
      pool: poolMetadata,
      liquidityPositions: LiquidityPosition[],
    }) => {
  const dispatch = useAppDispatch()
  const history = useHistory()

  const createLiquidityPositionButton =
    <Button
      size="small"
      href={`/liquidity/new/${pool.address}`}
      onClick={(e) => {
        dispatch(clearPoolCurrentData(pool.address))
        history.push(`/liquidity/new/${pool.address}`)
        e.preventDefault()
      }}>
      New Position
    </Button>

  const table = Object.values(liquidityPositions).length === 0
    ? <>
      <TableHeaderOnly headers={[
        'ID',
        'Liquidity',
        'Tick Lower',
        'Tick Upper',
        'Rewards',
        '',
      ]}
      />
      <LargeText style={{margin: 32}}>
        <Bold>
          No Positions
        </Bold>
      </LargeText>
    </>
    :
    <SimpleTable rows={Object.values(liquidityPositions).map((lqPos: LiquidityPosition) => (
      {
        key: lqPos.positionID,
        data: {
          'ID': lqPos.positionID,
          'Liquidity': lqPos.liquidity,
          'Tick Lower': lqPos.tickLower,
          'Tick Upper': lqPos.tickUpper,
          'Rewards': '~546 TCP',
          '': 'claim'
        },
        onClick: () => {
          dispatch(clearPoolCurrentData(pool.address))
          history.push(`/liquidity/${lqPos.positionID}`)
        }
      }
    ))} />

  const tableTitle =
    pool.token0.symbol + ':' + pool.token1.symbol + ' Pool - ' + pool.rewardsPortion + '% of TCP Liquidity rewards'

  return (
    <AppTile key={pool.address} title={tableTitle} rightElement={createLiquidityPositionButton} >
      {table}
    </AppTile>
  )
}

const ExistingLiquidityPositions = () => {
  const dispatch = useAppDispatch()

  const pools = waitForPoolsMetadata(selector, dispatch)
  const liquidityPositions = waitForLiquidityPositions(selector, dispatch)
  const userAddress = selector(state => state.wallet.address)

  if (pools === null || liquidityPositions === null || userAddress === null) {
    return (
      <div style={{ position: 'relative' }}>
        <RelativeLoading show={userAddress !== null} />
        <AppTile title="Liquidity Positions">
          {userAddress === null
            ? <Center>
              <div style={{ margin: 32 }}>
                <ConnectWalletButton />
              </div>
            </Center>
            : null
          }
        </AppTile>
      </div>
    )
  }

  const comparator = (a: LiquidityPosition, b: LiquidityPosition) => bnf(a.positionID).lt(bnf(b.positionID)) ? -1 : 1

  return (
    <>
      {Object.values(pools).sort((a, b) => b.rewardsPortion - a.rewardsPortion).map(pool => (
        <div key={pool.address} style={{ marginBottom: 18 }}>
          <LiquidityPositionsTable
            pool={pool}
            liquidityPositions={Object.values(liquidityPositions).filter(lqPos => lqPos.poolID === pool.poolID).sort(comparator)}
          />
        </div>
      ))}
    </>
  )
}

export default ExistingLiquidityPositions
