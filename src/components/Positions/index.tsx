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
import AppTile from '../library/AppTile'
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import { waitForPositions } from '../../slices/positions/api'
import { PositionMap } from '../../slices/positions'
import Center from '../library/Center'

import { numDisplay } from '../../utils'

const ExistingPositionsTile = ({}) => (
  <AppTile title="Debt positions">
    <ExistingPositionsContent positions={waitForPositions(selector, useAppDispatch())} />
  </AppTile>
)

const ExistingPositionsContent = ({positions}: { positions: PositionMap | null}) => {
  const headers = ['Position ID', 'Debt', 'Collateral']

  if (positions === null) {
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
          <TableRow key={row.key}>
            {Object.values(row.data).map((value) => <TableCell key={row.data.id + value}>{value}</TableCell>)}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default ExistingPositionsTile
