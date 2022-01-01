import { CSSProperties, ReactNode } from 'react';

const Text = ({
  size,
  monospace,
  bold,
  color,
  lineHeight,
  style,
  children,
}: {
  size?: number,
  monospace?: boolean,
  bold?: boolean,
  color?: string,
  lineHeight?: string,
  style?: CSSProperties,
  children: ReactNode
}) => {
  if (style === undefined) style = {}
  if (size) style.fontSize = size
  if (monospace) style.fontFamily = 'monospace'
  if (bold) style.fontWeight = 'bold'
  if (color) style.color = color
  if (lineHeight) style.lineHeight = lineHeight

  return <span style={style}>{children}</span>
}

export default Text
