import { ReactNode } from 'react';
import { CSSProperties } from 'react'

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
  if (!Array.isArray(children)) {
    return (
      <div style={style}>
        {children}
      </div>
    )
  }

  const realChildren = children.filter(child => child != null)

  return (
    <div style={style}>
      {
        row === true
        ? realChildren.map((child, index) =>
          index === realChildren.length - 1
            ? child
            : <span key={index} style={{ marginRight: spacing }}>{child}</span>)
        : realChildren.map((child, index) =>
          index === realChildren.length - 1
            ? child
            : <div key={index} style={{ marginBottom: spacing }}>{child}</div>)
      }
    </div>
  )
}

SpacedList.defaultProps = {
  spacing: 10,
}

export default SpacedList
