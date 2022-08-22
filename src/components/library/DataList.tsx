import { CSSProperties, ReactNode } from 'react';
import Bold from './Bold'
import {
  Tile,
  StructuredListRow,
  StructuredListBody,
  StructuredListCell,
  StructuredListHead,
  StructuredListWrapper,
  InlineLoading,
} from 'carbon-components-react'

export interface DataListRows {[title: string]: string | number | null}

const DataList = ({
  rows,
}: {
  rows: DataListRows,
}) =>
<StructuredListWrapper isCondensed>
  <StructuredListBody>
    {Object.entries(rows).map(([title, value]) => (
      <StructuredListRow tabIndex={0}>
        <StructuredListCell>
          <Bold>
            {title}
          </Bold>
        </StructuredListCell>
        <StructuredListCell>
          {value === null ? <InlineLoading /> : value}
        </StructuredListCell>
      </StructuredListRow>
    ))}
  </StructuredListBody>
</StructuredListWrapper>


export default DataList
