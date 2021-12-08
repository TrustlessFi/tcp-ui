import { Button } from 'carbon-components-react'
import { useHistory } from 'react-router-dom'
import AppTile from '../library/AppTile'
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import { clearPoolCurrentData } from '../../slices/poolCurrentData'
import { rewardsInfo } from '../../slices/rewards'
import { ContractsInfo } from '../../slices/contracts'
import { waitForLiquidityPositions, waitForPoolsMetadata, getPoolCurrentDataWaitFunction, waitForRewards, waitForContracts } from '../../slices/waitFor'
import { LiquidityPosition } from '../../slices/liquidityPositions'
import { bnf, tickToPriceDisplay, unscale, numDisplay, displaySymbol, timeToPeriod } from '../../utils/'
import LargeText from '../utils/LargeText'
import { poolMetadata } from '../../slices/poolsMetadata'
import Center from '../library/Center'
import SimpleTable, { TableHeaderOnly } from '../library/SimpleTable'
import RelativeLoading from '../library/RelativeLoading'
import ConnectWalletButton from '../utils/ConnectWalletButton'
import { TransactionType } from '../../slices/transactions'
import CreateTransactionButton from '../utils/CreateTransactionButton'

const LiquidityPositionsTable = (
  {
    pool,
    liquidityPositions,
    rewardsInfo,
    contracts,
  }: {
    pool: poolMetadata
    liquidityPositions: LiquidityPosition[]
    rewardsInfo: rewardsInfo
    contracts: ContractsInfo
  }) => {
  const dispatch = useAppDispatch()
  const history = useHistory()

  const poolCurrentData = getPoolCurrentDataWaitFunction(pool.address)(selector, dispatch)

  let table = <>
    <TableHeaderOnly headers={[
      'ID',
      'Liquidity',
      'Price Range',
      'Approximate Rewards',
    ]}
    />
    <LargeText style={{ margin: 32 }}>
      No Positions
    </LargeText>
  </>

  const token0Symbol = displaySymbol(pool.token0.symbol)
  const token1Symbol = displaySymbol(pool.token1.symbol)

  const tableTitle =
    token0Symbol + ':' + token1Symbol + ' Pool - ' +
    pool.rewardsPortion + '% of TCP Liquidity rewards '

  const priceUnit = token1Symbol + ' per ' + token0Symbol
  const tableSubtitle = 'Current Price: ' +
    (poolCurrentData === null
    ? '-'
    : tickToPriceDisplay(poolCurrentData.twapTick) + ' ' + priceUnit)

  const positionIDsWithRewards: string[] = []

  if (poolCurrentData !== null && Object.values(liquidityPositions).length > 0) {
    const rows = Object.values(liquidityPositions).map((lqPos) => {

      // TODO move this into the liquidity positions slice with rewardsInfo as an input arg,
      // and create a button inside the ExistingLiquidityPositions component that allows collecting ALL
      // rewards for all positions in all pools at once

      let approximateRewards = bnf(0)
      const lastTimeRewarded = lqPos.lastTimeRewarded
      const lastPeriodRewarded = timeToPeriod(lastTimeRewarded, rewardsInfo.periodLength, rewardsInfo.firstPeriod)

      if (lastPeriodRewarded < rewardsInfo.lastPeriodGlobalRewardsAccrued) {
        const avgDebtPerPeriod =
          bnf(rewardsInfo.rewardStatuses[lqPos.poolID].cumulativeLiquidity).sub(lqPos.cumulativeLiquidity)
            .div(rewardsInfo.lastPeriodGlobalRewardsAccrued - lastPeriodRewarded)

        if (!avgDebtPerPeriod.isZero()) {
          approximateRewards =
            bnf(lqPos.liquidity)
              .mul(bnf(rewardsInfo.rewardStatuses[lqPos.poolID].totalRewards).sub(lqPos.totalRewards))
              .div(avgDebtPerPeriod)
        }
      }

      if (!approximateRewards.isZero()) positionIDsWithRewards.push(lqPos.positionID)

      const liquidityDecimals = Math.floor((pool.token0.decimals + pool.token1.decimals) / 2)

      return {
        key: lqPos.positionID,
        data: {
          'ID': lqPos.positionID,
          'Liquidity': numDisplay(unscale(lqPos.liquidity, liquidityDecimals)),
          'Price Range': tickToPriceDisplay(lqPos.tickLower) + ' - ' + tickToPriceDisplay(lqPos.tickUpper) + ' ' + priceUnit,
          'Approximate Rewards': numDisplay(unscale(approximateRewards)) + ' TCP',
        },
        onClick: () => {
          dispatch(clearPoolCurrentData(pool.address))
          history.push(`/liquidity/increase/${pool.address}/${lqPos.positionID}`)
        }
      }
    })

    table = <SimpleTable rows={rows} />
  }

  const rightElement =
    <>
      <CreateTransactionButton
        small
        style={{marginRight: 8}}
        title="Claim All Rewards"
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
          dispatch(clearPoolCurrentData(pool.address))
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

  const rewardsInfo = waitForRewards(selector, dispatch)
  const contracts = waitForContracts(selector, dispatch)
  const pools = waitForPoolsMetadata(selector, dispatch)
  const liquidityPositions = waitForLiquidityPositions(selector, dispatch)
  const userAddress = selector(state => state.wallet.address)

  if (
    pools === null ||
    liquidityPositions === null ||
    userAddress === null ||
    rewardsInfo === null ||
    contracts === null
  ) {
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
            rewardsInfo={rewardsInfo}
            pool={pool}
            liquidityPositions={Object.values(liquidityPositions).filter(lqPos => lqPos.poolID === pool.poolID).sort(comparator)}
            contracts={contracts}
          />
        </div>
      ))}
    </>
  )
}

export default ExistingLiquidityPositions
