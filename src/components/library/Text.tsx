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
  const customStyle: CSSProperties = {
    fontSize: size,
    fontFamily: monospace ? 'monospace' : undefined,
    fontWeight: bold ? 'bold' : undefined,
    color,
    lineHeight,
  }

  const itemStyle =
    style === undefined
    ? customStyle
    : {...style, ...customStyle}

  return <span style={itemStyle}>{children}</span>
}

export default Text
