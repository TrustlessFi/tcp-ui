import React, { MouseEvent, useState, ReactNode } from 'react'
import { Button, Link, Tag, ModalWrapper } from 'carbon-components-react'
import { Copy16, Launch16, CarbonIconType } from '@carbon/icons-react'

export default ({
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
