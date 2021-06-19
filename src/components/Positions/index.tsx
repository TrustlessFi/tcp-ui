import React from "react";
import {
  DataTable,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell
} from "carbon-components-react";
import AppTile from "../library/AppTile";
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import { store } from '../../app/store'
import { getPositions } from '../../slices/positions'

import { numDisplay } from "../../utils";

const ExistingPositionsTile = ({}) => {
  const dispatch = useAppDispatch()

  const chainIDState = selector(state => state.chainID)
  const userAddress = selector(state => state.wallet.address)
  const sdi = selector(state => state.systemDebt)
  const marketInfo = selector(state => state.market)

  const positions = selector(state => state.positions.data)
  if (positions === null) {
    // cant subscribe to this update or else we would get an infinite loop
    if (!store.getState().positions.loading) {
      dispatch(getPositions({dispatch, chainIDState, userAddress, sdi, marketInfo }))
    }
    return <>Loading Spinner</>
  }

  if (Object.values(positions).length === 0) <>There are no positions</>

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
