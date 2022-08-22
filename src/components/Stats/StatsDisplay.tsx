import OneColumnDisplay from '../library/OneColumnDisplay'
import waitFor from '../../slices/waitFor'
import SpacedList from '../library/SpacedList'
import TitleText from '../library/TitleText'
import DataList, { DataListRows } from '../library/DataList'
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import {
  Tile,
} from 'carbon-components-react'
import { numDisplay } from '../../utils'


const StatsSection = ({
  title,
  rows,
}: {
  title: string
  rows: DataListRows
}) =>
  <SpacedList spacing={16}>
    <TitleText>
      {title}
    </TitleText>
    <DataList rows={rows} />
  </SpacedList>

const StatsDisplay = () => {
  const dispatch = useAppDispatch()

  const {
    hueInfo,
    huePositionNftInfo,
    balances,
    liquidationsInfo,
    marketInfo,
    protocolBalances,
    ratesInfo,
  } = waitFor([
    'hueInfo',
    'huePositionNftInfo',
    'balances',
    'liquidationsInfo',
    'marketInfo',
    'protocolBalances',
    'ratesInfo'
  ], selector, dispatch)

  const totalRevenue =
    ratesInfo === null || hueInfo === null
      ? null
      : ratesInfo.interestRate * hueInfo.totalSupply

  const interestPortionToLenders =
    marketInfo === null
      ? null
      : marketInfo.interestPortionToLenders

  const revenueToLenders =
    totalRevenue === null || interestPortionToLenders === null
      ? null
      : totalRevenue * interestPortionToLenders

  const excessRevenue =
    totalRevenue === null || revenueToLenders === null
      ? null
      : totalRevenue - revenueToLenders

  return (
    <OneColumnDisplay loading={false}>
      <Tile style={{padding: 40, marginTop: 40}}>
        <SpacedList spacing={15}>
          <StatsSection
            title='Debt'
            rows={{
              'Total Debt': hueInfo === null ? null : `${numDisplay(hueInfo.totalSupply)} Hue`,
              'Total Collateral': balances === null ? null : `${numDisplay(balances.accountingEthBalance)} TruEth `,
            }}
          />
          <StatsSection
            title='Positions'
            rows={{
              'Count Total Positions': huePositionNftInfo === null ? null : numDisplay(huePositionNftInfo.nextPositionID - 1),
              'Average Position Debt':
                huePositionNftInfo === null || hueInfo === null
                  ? null
                  : `${numDisplay(hueInfo.totalSupply / (huePositionNftInfo.nextPositionID - 1))} Hue `,
              'Average Position Collateral':
                balances === null || huePositionNftInfo === null
                  ? null
                  : `${numDisplay(balances.accountingEthBalance / (huePositionNftInfo.nextPositionID - 1))} TruEth `,
              'Minimum Position Size':
                marketInfo === null
                  ? null
                  : `${numDisplay(marketInfo.minPositionSize)} Hue `
            }}
          />
          <StatsSection
            title='Lending'
            rows={{
              'Total Hue Lent': protocolBalances === null ? null : `${numDisplay(protocolBalances.accountingHueBalance)} Hue`,
            }}
          />
          <StatsSection
            title='Revenue'
            rows={{
              'Current Interest on Debt': ratesInfo === null ? null : `${numDisplay(ratesInfo.interestRate * 100)} %`,
              'Total Annual Revenue': totalRevenue === null ? null : `${numDisplay(totalRevenue, 0)} Hue`,
              'Revenue Portion to Lenders': interestPortionToLenders === null ? null : `${numDisplay(interestPortionToLenders * 100)} %`,
              'Revenue to Lenders': revenueToLenders === null ? null : `${numDisplay(revenueToLenders)} Hue`,
              'Excess Revenue': excessRevenue === null ? null : `${numDisplay(excessRevenue)} Hue`,
              'Current Reserves': protocolBalances === null ? null : `${numDisplay(protocolBalances.reserves, 0)} Hue`,
            }}
          />
          <StatsSection
            title='Liquidation Configuration'
            rows={{
              'Discovery Incentive': liquidationsInfo === null ? null : `${numDisplay(liquidationsInfo.discoveryIncentive * 100)} %`,
              'Liquidation Incentive': liquidationsInfo === null
                  ? null
                  : `${numDisplay((liquidationsInfo.liquidationIncentive - 1) * 100)} %`,
              'Twap Duration': liquidationsInfo === null
                  ? null
                  : `${numDisplay(liquidationsInfo.twapDuration / 60)} minutes`,
            }}
          />
        </SpacedList>
      </Tile>
    </OneColumnDisplay>
  )
}

export default StatsDisplay
