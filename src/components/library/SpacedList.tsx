import { ReactNode } from 'react';

export enum ListDirection {
  Row = 'Row',
  Col = 'Col',
}

const SpacedList = ({
  spacing,
  children,
  direction
}: {
  spacing: number,
  children: ReactNode | ReactNode[],
  direction: ListDirection
}) => {
  return (
    <>
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
    </>
  )
}

SpacedList.defaultProps = {
  direction: ListDirection.Col,
  small: false,
}

export default SpacedList
