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
import { waitForPositions } from '../../slices/waitFor'
import PositionEditor from './PositionEditor'
import ExistingPositions from './ExistingPositions'

import { numDisplay } from '../../utils'

export default ({}) => selector(state => state.positionsEditor.open)
  ? <PositionEditor />
  : (
      <>
        <ExistingPositions />
      </>
    )
