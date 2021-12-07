import { CSSProperties, ReactNode } from 'react';
import Text from './Text'

const Bold = ({
  children,
  style,
}: {
  children: ReactNode
  style?: CSSProperties,
}) => {
  return (
    <Text bold={true} style={style}>
      {children}
    </Text>
  )
}

export default Bold
