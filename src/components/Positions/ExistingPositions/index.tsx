import React from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  DataTableSkeleton,
} from 'carbon-components-react'
import AppTile from '../../library/AppTile'
import { useAppDispatch, useAppSelector as selector } from '../../../app/hooks'
import { editorOpened } from '../../../slices/positionsEditor'
import { waitForPositions } from '../../../slices/positions/api'
import { waitForGovernor } from '../../../slices/governor/api'
import Center from '../../library/Center'

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
  const governor = waitForGovernor(selector, dispatch)

  if (positions === null || governor === null) {
    return <DataTableSkeleton headers={headers.map(header => ({key: header}))} rowCount={3} />
  }

  if (Object.values(positions).length === 0) return <Center>There are no positions</Center>

  const rows = Object.values(positions).map(position => ({
    key: position.id,
    data: {
      id: position.id,
      debt: position.debtCount + ' Hue',
      collateral: numDisplay(position.collateralCount) + ' Eth',
    }
  }))

  const rowSelected = (id: number) => () => dispatch(editorOpened({
    positionID: id,
    creating: false,
    isGenesis: false,
  }))

  return (
    <Table>
      <TableHead>
        <TableRow>
          {headers.map((header) => (
            <TableHeader key={header}>{header}</TableHeader>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.key} onClick={rowSelected(row.data.id)}>
            {Object.values(row.data).map((value) => <TableCell key={row.data.id + value}>{value}</TableCell>)}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
