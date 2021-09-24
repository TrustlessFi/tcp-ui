import { ReactNode } from "react";
import Text from './Text'

const LargeText = ({
  monospace,
  bold,
  color,
  children,
}: {
  monospace?: boolean,
  bold?: boolean,
  color?: string,
  children: ReactNode
}) => {
  return (
    <Text
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
