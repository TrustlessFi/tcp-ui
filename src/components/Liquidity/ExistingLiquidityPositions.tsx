import { Button } from 'carbon-components-react'
import AppTile from '../library/AppTile'
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import { startCreate, startEdit } from '../../slices/liquidityPositionsEditor'
import { waitForLiquidityPositions, waitForPoolMetadata } from '../../slices/waitFor'
import { LiquidityPosition } from '../../slices/liquidityPositions'
import { bnf } from '../../utils/'
import { poolMetadata } from '../../slices/poolMetadata'
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

  const createLiquidityPositionButton =
    <Button
      size="small"
      onClick={() => dispatch(startCreate({ poolAddress: pool.address }))}>
      New Position
    </Button>

  if (Object.values(liquidityPositions).length === 0) {
    return (
      <>
        <TableHeaderOnly headers={[
          'Position ID',
          'Liquidity',
          'Tick Lower',
          'Tick Upper',
          'Rewards',
          '',
        ]} />
        <Center style={{padding: 24}}>
          {createLiquidityPositionButton}
        </Center>
      </>
    )
  }

  const rows = Object.values(liquidityPositions).map((lqPos: LiquidityPosition) => (
    {
      key: lqPos.positionID,
      data: {
        'Position ID': lqPos.positionID,
        'Liquidity': lqPos.liquidity,
        'Tick Lower': lqPos.tickUpper,
        'Tick Upper': lqPos.tickLower,
        'Rewards': '~546 TCP',
        '': 'claim'
      },
      onClick: () => dispatch(startEdit({ positionID: lqPos.positionID, }))
    }
  ))
  return (
    <>
      <SimpleTable rows={rows} />
      <Center style={{padding: 24}}>
        {createLiquidityPositionButton}
      </Center>
    </>
  )
}

const ExistingLiquidityPositions = () => {
  const dispatch = useAppDispatch()

  const pools = waitForPoolMetadata(selector, dispatch)
  const liquidityPositions = waitForLiquidityPositions(selector, dispatch)
  const userAddress = selector(state => state.wallet.address)


  if (pools === null || liquidityPositions === null || userAddress === null) {
    return (
      <div style={{position: 'relative'}}>
        <RelativeLoading show={userAddress !== null} />
        <Center>
          <div style={{margin: 32}}>
            <ConnectWalletButton />
          </div>
        </Center>
      </div>
    )
  }

  const comparator = (a: LiquidityPosition, b: LiquidityPosition) => bnf(a.positionID).lt(bnf(b.positionID)) ? -1 : 1

  return (
    <AppTile title="Uniswap Reward Positions">
      {Object.values(pools).sort((a, b) => a.poolID - b.poolID).map(pool => (
        <>
          <h4>{pool.token0.info.symbol}:{pool.token1.info.symbol} {pool.fee / 10000}%</h4>
          <h5>{pool.rewardsPortion}% of TCP Liquidity rewards</h5>
          <LiquidityPositionsTable
            pool={pool}
            liquidityPositions={Object.values(liquidityPositions).filter(lqPos => lqPos.poolID === pool.poolID).sort(comparator)}
          />
        </>
      ))}
    </AppTile>
  )
}

export default ExistingLiquidityPositions