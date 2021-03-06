import { CSSProperties, ReactNode } from 'react';

const Text = ({
  size,
  monospace,
  bold,
  light,
  color,
  lineHeight,
  style,
  children,
}: {
  size?: number,
  monospace?: boolean,
  bold?: boolean,
  light?: boolean,
  color?: string,
  lineHeight?: string | number,
  style?: CSSProperties,
  children: ReactNode
}) => {
  const customStyle: CSSProperties = {
    fontSize: size,
    fontFamily: monospace ? 'monospace' : undefined,
    fontWeight: bold ? 'bold' : (light ? 'lighter' : undefined),
    color,
    lineHeight,
  }

  const itemStyle =
    style === undefined
    ? customStyle
    : {...style, ...customStyle}

  return <span style={itemStyle}>{children}</span>
}

Text.defaultProps = {
  size: 14
}

export default Text
