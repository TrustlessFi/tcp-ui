import { CSSProperties, ReactNode } from 'react';
import Text from './Text'

const LargeText = ({
  monospace,
  bold,
  color,
  style,
  size,
  children,
}: {
  monospace?: boolean,
  bold?: boolean,
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
      color={color}>
      {children}
    </Text>
  )
}

LargeText.defaultProps = {
  size: 20
}

export default LargeText
