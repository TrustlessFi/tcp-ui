import React from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell
} from "carbon-components-react";
import AppTile from "../library/AppTile";
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import { waitForPositions } from '../../slices/positions/api'

import { numDisplay } from "../../utils";

const ExistingPositionsTile = ({}) => {
  const positions = waitForPositions(selector, useAppDispatch())

  if (positions === null) return <>Loading Spinner</>

  if (Object.values(positions).length === 0) return <>There are no positions</>

  const rows = Object.values(positions).map(position => ({
    key: position.id,
    data: {
      id: position.id,
      debt: position.debtCount + ' Hue',
      collateral: numDisplay(position.collateralCount) + ' Eth',
    }
  }))

  const headers = ['Position ID', 'Debt', 'Collateral']

  return (
    <AppTile title="Debt positions">
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
    </AppTile>
  );
};

export default ExistingPositionsTile;
