import { CSSProperties, ReactNode } from 'react';
import Text from './Text'

const LargeText = ({
  monospace,
  bold,
  color,
  style,
  children,
}: {
  monospace?: boolean,
  bold?: boolean,
  color?: string,
  style?: CSSProperties,
  children: ReactNode
}) => {
  return (
    <Text
      style={style}
      size={20}
      lineHeight="26px"
      monospace={monospace}
      bold={bold}
      color={color}>
      {children}
    </Text>
  )
}

export default LargeText
