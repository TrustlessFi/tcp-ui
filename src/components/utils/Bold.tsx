import { ReactNode } from "react";
import Text from './Text'

const Bold = ({
  children,
}: {
  children: ReactNode
}) => {
  return (
    <Text bold={true}>
      {children}
    </Text>
  )
}

export default Bold
