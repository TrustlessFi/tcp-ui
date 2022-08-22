import OneColumnDisplay from '../library/OneColumnDisplay'
import waitFor from '../../slices/waitFor'
import SpacedList from '../library/SpacedList'
import TitleText from '../library/TitleText'
import DataList  from '../library/DataList'
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
  rows: {[key: string]: string | null},
}) =>
  <SpacedList spacing={32}>
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
  } = waitFor([
    'hueInfo',
    'huePositionNftInfo',
    'balances',
  ], selector, dispatch)

  return (
    <OneColumnDisplay loading={false}>
      <Tile style={{padding: 40, marginTop: 40}}>
        <SpacedList spacing={64}>
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
                  : `${numDisplay(balances.accountingEthBalance / (huePositionNftInfo.nextPositionID - 1))} TruEth `
            }}
          />
        </SpacedList>
      </Tile>
    </OneColumnDisplay>
  )
}

export default StatsDisplay
