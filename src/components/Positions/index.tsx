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
import { getPositions } from '../../slices/positions'

import { numDisplay } from "../../utils";

type row = { id: number; debt: string; collateral: string };

const ExistingPositionsTile = ({}) => {
  const dispatch = useAppDispatch()
  // try to just retrieve the positions
  const positions = selector(state => state.positions.data)
  if (positions === null) {
    dispatch(getPositions({
      dispatch,
      chainIDState: selector(state => state.chainID),
      userAddress:selector(state => state.wallet.address),
      sdi: selector(state => state.systemDebt.data),
      marketInfo: selector(state => state.market.data),
    }))
    return <>Loading Spinner</>
  }

  if (Object.values(positions).length === 0) <>There are no positions</>

  const rowData: row[] = Object.values(positions).map(position => {
    return {
      id: position.id,
      debt: position.debtCount + ' Hue',
      collateral: numDisplay(position.collateralCount) + ' Eth'
    };
  });

  const headerData = ['ID', 'Debt', 'Collateral'].map(header => {
    return { key: header.toLowerCase(), header };
  })

  console.log({rowData, headerData})

  return <>Logged rows</>

  /*
  return (
    <AppTile title="Debt Positions">
      <DataTable rows={rowData} headers={headerData}>
        {({ rows, headers, getHeaderProps, getTableProps }) => (
          <TableContainer>
            <Table {...getTableProps()}>
              <TableHead>
                <TableRow>
                  {headers.map(header => (
                    <TableHeader {...getHeaderProps({ header })}>
                      {header.header}
                    </TableHeader>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map(row => (
                  <TableRow key={row.id} onClick={() => {}}>
                    {row.cells.map(cell => (
                      <TableCell key={cell.id}>{cell.value}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DataTable>
    </AppTile>
  );
  */
};

export default ExistingPositionsTile;
