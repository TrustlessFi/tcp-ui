import React from "react";
import { DataTableSkeleton } from 'carbon-components-react'
import AppTile from '../../library/AppTile'
import { useAppDispatch, useAppSelector as selector } from '../../../app/hooks'
import { editorOpened } from '../../../slices/positionsEditor'
import { waitForPositions, waitForGovernor } from '../../../slices/waitFor'
import Center from '../../library/Center'
import SimpleTable from '../../library/SimpleTable'

import { numDisplay } from '../../../utils'

export default () => (
  <AppTile title="Debt positions">
    <ExistingPositionsTable />
  </AppTile>
)

const ExistingPositionsTable = ({}) => {
  const headers = ['Position ID', 'Debt', 'Collateral']
  const dispatch = useAppDispatch()

  const positions = waitForPositions(selector, dispatch)

  if (positions === null) {
    return <DataTableSkeleton headers={headers.map(header => ({key: header}))} rowCount={3} />
  }

  if (Object.values(positions).length === 0) return <Center>There are no positions</Center>

  const rows = Object.values(positions).map(position => ({
    key: position.id,
    data: {
      'Position ID': position.id,
      'Debt': position.debtCount + ' Hue',
      'Collateral': numDisplay(position.collateralCount) + ' Eth',
    },
    onClick: () => dispatch(editorOpened({
      positionID: position.id,
      creating: false,
      isGenesis: false,
    }))
  }))

  return <SimpleTable rows={rows} />
}
