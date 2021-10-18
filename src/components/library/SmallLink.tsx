import React, { CSSProperties } from "react";
import { Link } from 'carbon-components-react'
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
  children: React.ReactChild,
}) => {
  const linkAttributes = {
    renderIcon: icon,
    href,
    onClick,
    target: '_blank'
  }

  if (style === undefined) style ={}
  style.cursor = 'pointer'

  return (
    <Link
      {...linkAttributes}
      style={style}>
      {children}
    </Link>
  )
}

export default SmallLink
