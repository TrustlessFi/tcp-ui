import React, { FunctionComponent } from 'react';
import { Tag, TagTypeName } from 'carbon-components-react';
import { ArrowDown16, ArrowUp16 } from '@carbon/icons-react';

export enum IconMap {
  ArrowDown16 = 'ArrowDown16',
  ArrowUp16 = 'ArrowUp16'
}

const iconMap = {
  ArrowDown16,
  ArrowUp16,
};

interface AppTagProps {
  color?: TagTypeName;
  icon?: IconMap;
  name: string;
  onClick?: () => void;
  selected?: boolean
}

export const AppTag: FunctionComponent<AppTagProps> = ({
  color = "gray" as TagTypeName,
  icon,
  name,
  onClick,
  selected = false,
}) => (
  <Tag
    type={color}
    key={name}
    onClick={onClick}
    style={{ marginLeft: 8, outline: 0, opacity: selected ? "100%" : "65%" }}
    renderIcon={icon ? iconMap[icon] : undefined}
  >
    {name}
  </Tag>
);
