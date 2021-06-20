import React from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
} from 'carbon-components-react'

type row = {
  key: string | number
  onClick?: () => any
  data: { [key in string]: any }
}

export default ({rows}: {rows: row[]}) => rows.length === 0 ? null : (
  <Table>
    <TableHead>
      <TableRow>
        {Object.keys(rows[0].data).map((header) => (
          <TableHeader key={header}>{header}</TableHeader>
        ))}
      </TableRow>
    </TableHead>
    <TableBody>
      {rows.map((row) => (
        <TableRow key={row.key} onClick={row.onClick}>
          {Object.values(row.data).map((value, idx) => <TableCell key={row.key.toString() + idx.toString()}>{value}</TableCell>)}
        </TableRow>
      ))}
    </TableBody>
  </Table>
)