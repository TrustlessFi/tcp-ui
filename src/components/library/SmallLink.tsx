import { ReactNode } from 'react'
import { Button } from 'carbon-components-react'
import { CarbonIconType } from '@carbon/icons-react'

const SmallLink = ({
  icon,
  href,
  onClick,
  children,
}: {
  icon?: CarbonIconType,
  href?: string,
  onClick?: () => void,
  children: ReactNode,
}) => {
  return <Button renderIcon={icon} href={href} onClick={onClick} kind="ghost" size="small">{children}</Button>
}

export default SmallLink
