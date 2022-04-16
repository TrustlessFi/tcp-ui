import { CSSProperties, ReactNode } from 'react';
import Text from './Text'

const LargeText = ({
  monospace,
  bold,
  light,
  color,
  style,
  size,
  children,
}: {
  monospace?: boolean,
  bold?: boolean,
  light?: boolean,
  color?: string,
  style?: CSSProperties,
  size?: number
  children: ReactNode
}) => {
  return (
    <Text
      style={style}
      size={size}
      lineHeight="26px"
      monospace={monospace}
      bold={bold}
      light={light}
      color={color}>
      {children}
    </Text>
  )
}

LargeText.defaultProps = {
  size: 20
}

export default LargeText
