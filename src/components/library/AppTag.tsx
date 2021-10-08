import React, { FunctionComponent } from 'react';
import { Tag, TagTypeName } from 'carbon-components-react';

interface AppTagProps {
  color?: TagTypeName;
  name: string;
  onClick: () => void;
  selected?: boolean
}

export const AppTag: FunctionComponent<AppTagProps> = ({
  color = "gray" as TagTypeName,
  name,
  onClick,
  selected = false,
}) => {
  return (
    <Tag
      type={color}
      key={name}
      onClick={onClick}
      style={{ marginLeft: 8, outline: 0, opacity: selected ? "100%" : "65%" }}
    >
      {name}
    </Tag>
  );
};
