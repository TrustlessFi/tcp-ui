import { CSSProperties, ReactNode } from "react";
import { Button, Link } from 'carbon-components-react'
import { CarbonIconType } from '@carbon/icons-react'

const SmallLink = ({
  icon,
  href,
  onClick,
  style,
  renderAsButton,
  children,
}: {
  icon?: CarbonIconType,
  href?: string,
  onClick?: () => void,
  style?: CSSProperties,
  renderAsButton?: boolean,
  children: ReactNode,
}) => {
  const linkAttributes = {
    renderIcon: icon,
    href,
    onClick,
    target: '_blank'
  }

  if (style === undefined) style ={}
  style.cursor = 'pointer'

  return renderAsButton ? (
    <Button
      {...linkAttributes}
      style={style}
      kind="ghost"
      size="small">
      {children}
    </Button>
  ) : (
    <Link
      {...linkAttributes}
      style={style}>
      {children}
    </Link>
  )
}

export default SmallLink
