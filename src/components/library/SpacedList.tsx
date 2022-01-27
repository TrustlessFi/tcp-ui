import { ReactNode } from 'react';
import { CSSProperties } from 'react'

export enum ListDirection {
  Row = 'Row',
  Col = 'Col',
}

const SpacedList = ({
  spacing,
  children,
  row,
  style,
}: {
  spacing: number
  children: ReactNode | ReactNode[]
  row?: boolean
  style?: CSSProperties
}) => {
  return (
    <div style={style}>
      {Array.isArray(children)
        ? (row === true
          ? children.map((child, index) =>
            index === children.length - 1
              ? child
              : <span key={index} style={{ marginRight: spacing }}>{child}</span>)
          : children.map((child, index) =>
            index === children.length - 1
              ? child
              : <div key={index} style={{ marginBottom: spacing }}>{child}</div>
          )
        ) : children}
    </div>
  )
}

SpacedList.defaultProps = {
  spacing: 8,
}

export default SpacedList
