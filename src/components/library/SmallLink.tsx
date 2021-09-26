import { CSSProperties, ReactNode } from "react";
import { Button } from 'carbon-components-react'
import { CarbonIconType } from '@carbon/icons-react'

const SmallLink = ({
  icon,
  href,
  onClick,
  style,
  children,
}: {
  icon?: CarbonIconType,
  href?: string,
  onClick?: () => void,
  style?: CSSProperties,
  children: ReactNode,
}) => {
  return <Button renderIcon={icon} href={href} onClick={onClick} kind="ghost" size="small" style={style}>{children}</Button>
}

export default SmallLink
