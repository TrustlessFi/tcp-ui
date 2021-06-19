import React from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  DataTableSkeleton,
  Button
} from 'carbon-components-react'
import AppTile from '../../library/AppTile'
import { useAppDispatch, useAppSelector as selector } from '../../../app/hooks'
import { waitForPositions } from '../../../slices/waitFor'
import { PositionMap } from '../../../slices/positions'
import Center from '../../library/Center'
import { editorClosed } from '../../../slices/positionsEditor'

export default ({}) => {
  const dispatch = useAppDispatch()
  const editorStatus = selector(state => state.positionsEditor.status)

  return (
    <>
      <Button onClick={() => dispatch(editorClosed())}>Go Back</Button>
      <AppTile title="Debt positions">
        Hello whorld
      </AppTile>
    </>
  )
}

const UpdatePositionPage = ({id}: { id: number}) => {
  const positions = selector(state => state.positions.data)
  if (positions === null || !(positions.hasOwnProperty(id))) throw new Error('Position ' + id + ' not found.')
  const position = positions[id]


}
