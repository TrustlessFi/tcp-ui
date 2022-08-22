import OneColumnDisplay from '../library/OneColumnDisplay'
import waitFor from '../../slices/waitFor'
import SpacedList from '../library/SpacedList'
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import {
  Tile,
  StructuredListRow,
  StructuredListBody,
  StructuredListCell,
  StructuredListHead,
  StructuredListWrapper,
  InlineLoading,
} from 'carbon-components-react'
import { numDisplay } from '../../utils'


enum StatsColumn {
  Title = 'Title',
  Data = 'Data',
}

type StatsRow = {[column in StatsColumn]: string | null}

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

  const displayData: StatsRow[] = [
    {
      [StatsColumn.Title]: 'Total Debt',
      [StatsColumn.Data]: hueInfo === null ? null : `${numDisplay(hueInfo.totalSupply)} Hue`
    },{
      [StatsColumn.Title]: 'Total Collateral',
      [StatsColumn.Data]:
        balances === null
          ? null
          : `${numDisplay(balances.accountingEthBalance)} TruEth `
    },{
      [StatsColumn.Title]: 'Count Total Positions',
      [StatsColumn.Data]: huePositionNftInfo === null ? null : numDisplay(huePositionNftInfo.nextPositionID - 1)
    },{
      [StatsColumn.Title]: 'Average Position Debt',
      [StatsColumn.Data]:
        huePositionNftInfo === null || hueInfo === null
          ? null
          : `${numDisplay(hueInfo.totalSupply / (huePositionNftInfo.nextPositionID - 1))} Hue `
    },{
      [StatsColumn.Title]: 'Average Position Collateral',
      [StatsColumn.Data]:
        balances === null || huePositionNftInfo === null
          ? null
          : `${numDisplay(balances.accountingEthBalance / (huePositionNftInfo.nextPositionID - 1))} TruEth `
    }
  ]

  return (
    <OneColumnDisplay loading={false}>
      <Tile style={{padding: 40, marginTop: 40}}>
        <StructuredListWrapper ariaLabel="Structured list">
          <StructuredListHead>
            <StructuredListRow head tabIndex={0} >
              <StructuredListCell head>
                Title
              </StructuredListCell>
              <StructuredListCell head>
                Data
              </StructuredListCell>
            </StructuredListRow>
          </StructuredListHead>
          <StructuredListBody>
            {displayData.map(data => (
              <StructuredListRow tabIndex={0}>
                <StructuredListCell>
                  {data[StatsColumn.Title]}
                </StructuredListCell>
                <StructuredListCell>
                  {data[StatsColumn.Data] === null ? <InlineLoading /> : data[StatsColumn.Data]}
                </StructuredListCell>
              </StructuredListRow>
            ))}
          </StructuredListBody>
        </StructuredListWrapper>
      </Tile>
    </OneColumnDisplay>
  )
}

export default StatsDisplay
