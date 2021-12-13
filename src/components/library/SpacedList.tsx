import { ReactNode } from 'react';
import {  CSSProperties } from 'react'

export enum ListDirection {
  Row = 'Row',
  Col = 'Col',
}

const SpacedList = ({
  spacing,
  children,
  direction,
  style,
}: {
  spacing: number,
  children: ReactNode | ReactNode[],
  direction: ListDirection
  style?: CSSProperties
}) => {
  return (
    <div style={style}>
      {Array.isArray(children)
        ? (direction === ListDirection.Col
          ? children.map((child, index) =>
            index === children.length - 1
              ? child
              : <div key={index} style={{ marginBottom: spacing }}>{child}</div>
          )
          : children.map((child, index) =>
            index === children.length - 1
              ? child
              : <span key={index} style={{ marginRight: spacing }}>{child}</span>)
        ) : children}
    </div>
  )
}

SpacedList.defaultProps = {
  direction: ListDirection.Col,
  small: false,
  spacing: 8,
}

export default SpacedList
