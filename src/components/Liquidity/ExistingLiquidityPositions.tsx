import { Button } from 'carbon-components-react'
import { MouseEvent, useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import AppTile from '../library/AppTile'
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import waitFor from '../../slices/waitFor'
import { LiquidityPosition } from '../../slices/liquidityPositions'
import { bnf, tickToPriceDisplay, unscale, numDisplay, displaySymbol } from '../../utils/'
import { poolMetadata } from '../../slices/poolsMetadata'
import Center from '../library/Center'
import SimpleTable from '../library/SimpleTable'
import SpacedList from '../library/SpacedList'
import { TransactionType } from '../../slices/transactions'
import ConnectWalletButton from '../library/ConnectWalletButton'
import CreateTransactionButton from '../library/CreateTransactionButton'

const sortPoolsByPositionID = (a: LiquidityPosition, b: LiquidityPosition) => bnf(a.positionID).lt(bnf(b.positionID)) ? -1 : 1

const LiquidityPositionsTable = (
  { pool }: {
    pool: poolMetadata
  }) => {
  const dispatch = useAppDispatch()
  const history = useHistory()

  const {
    contracts,
    liquidityPositions,
    poolsCurrentData,
    userAddress
  } = waitFor(['contracts', 'liquidityPositions', 'poolsCurrentData', 'userAddress'], selector, dispatch)

  const poolLiquidityPositions =
    liquidityPositions === null
    ? []
    : Object.values(liquidityPositions).filter(lqPos => lqPos.poolID === pool.poolID).sort(sortPoolsByPositionID)

  const [inverted, setInverted] = useState(false)

  useEffect(() => {
    if (poolLiquidityPositions.length === 0) return
    setInverted(poolLiquidityPositions[0].tickLower + poolLiquidityPositions[0].tickUpper < 0)
  }, [liquidityPositions])

  const invert = () => setInverted(!inverted)

  const token0Symbol = displaySymbol(pool.token0.symbol)
  const token1Symbol = displaySymbol(pool.token1.symbol)

  const tableTitle =
    token0Symbol + ':' + token1Symbol + ' Pool - ' +
    pool.rewardsPortion + '% of TCP Liquidity rewards '

  const priceUnit =
    inverted
    ? token0Symbol + ' per ' + token1Symbol
    : token1Symbol + ' per ' + token0Symbol

  const poolTick = poolsCurrentData && poolsCurrentData[pool.address]?.twapTick

  let table =
    <Center style={{padding: 32}}>
      {
        userAddress === null
        ? <ConnectWalletButton size='sm' />
        : `You have no ${token0Symbol}:${token1Symbol} positions.`
      }
    </Center>

  const tableSubtitle =
    <div onClick={invert}>
      Current Price:{' '}
      {
        (poolTick === null
        ? '-'
        : tickToPriceDisplay(
            inverted
            ? -poolTick
            : poolTick
          ) + ' ' + priceUnit)
      }
    </div>

  const positionIDsWithRewards: string[] = []
  let totalRewards = 0

  if (poolsCurrentData !== null && Object.values(poolLiquidityPositions).length > 0) {
    const rows = Object.values(poolLiquidityPositions).map((lqPos) => {

      const isInRange = poolTick === null || (lqPos.tickLower < poolTick && poolTick < lqPos.tickUpper)

      if (lqPos.approximateRewards !== 0) {
        positionIDsWithRewards.push(lqPos.positionID)
        totalRewards += lqPos.approximateRewards
      }

      const liquidityDecimals = Math.floor((pool.token0.decimals + pool.token1.decimals) / 2)

      const getTick = (lower: boolean) =>
        lower
        ? (inverted ? -lqPos.tickUpper : lqPos.tickLower)
        : (inverted ? -lqPos.tickLower : lqPos.tickUpper)

      const priceRangeText = `${tickToPriceDisplay(getTick(true))} - ${tickToPriceDisplay(getTick(false))} ${priceUnit}`

      const onOutOfRangeButtonClick = (e: MouseEvent) => {
        history.push(`/liquidity/decrease/${pool.address}/${lqPos.positionID}?outOfRange=1`)
        e.stopPropagation()
      }

      return {
        key: lqPos.positionID,
        data: {
          'ID': lqPos.positionID,
          'Liquidity': numDisplay(unscale(lqPos.liquidity, liquidityDecimals)),
          'Price Range': isInRange
            ? priceRangeText
            : (
              <Button
                size='sm'
                kind='danger'
                onClick={onOutOfRangeButtonClick}
              >
                {priceRangeText}
              </Button>
            ),
          'Approximate Rewards': numDisplay(lqPos.approximateRewards) + ' TCP',
        },
        onClick: () => {
          history.push(`/liquidity/increase/${pool.address}/${lqPos.positionID}`)
        }
      }
    })

    table = <SimpleTable rows={rows} />
  }

  const rightElement =
    <>
      <CreateTransactionButton
        size="sm"
        style={{marginRight: 8}}
        title={`Claim ${numDisplay(totalRewards)} Tcp`}
        disabled={positionIDsWithRewards.length === 0}
        showDisabledInsteadOfConnectWallet={true}
        txArgs={{
          type: TransactionType.ClaimAllLiquidityPositionRewards,
          positionIDs: positionIDsWithRewards,
          Rewards: contracts === null ? '' : contracts.Rewards,
        }}
      />
      <Button
        size="small"
        href={`/liquidity/new/${pool.address}`}
        onClick={(e) => {
          history.push(`/liquidity/new/${pool.address}`)
          e.preventDefault()
        }}>
        New Position
      </Button>
    </>

  return (
    <AppTile
      key={pool.address}
      title={tableTitle}
      subTitle={tableSubtitle}
      rightElement={rightElement} >
      {table}
    </AppTile>
  )
}

const ExistingLiquidityPositions = () => {
  const dispatch = useAppDispatch()

  const { poolsMetadata } = waitFor(['poolsMetadata'], selector, dispatch)

  const sortedPools =
    poolsMetadata === null
    ? []
    : Object.values(poolsMetadata).sort((a, b) => b.rewardsPortion - a.rewardsPortion)

  return (
    <SpacedList spacing={32}>
      {sortedPools.map((pool) => (
        <LiquidityPositionsTable pool={pool} />
      ))}
    </SpacedList>
  )
}

export default ExistingLiquidityPositions
