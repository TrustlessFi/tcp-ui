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

const DataList = ({
  rows,
}: {
  rows: {[key: string]: string | null},
}) =>
<StructuredListWrapper>
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
