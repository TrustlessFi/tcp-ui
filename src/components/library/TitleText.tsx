import { CSSProperties, ReactNode } from 'react';
import Text from './Text'

const TitleText = ({
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

TitleText.defaultProps = {
  size: 28
}

export default TitleText
