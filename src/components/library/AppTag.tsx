import React, { FunctionComponent } from 'react';
import { Tag, TagTypeName } from 'carbon-components-react';

interface AppTagProps {
  color?: TagTypeName;
  name: string;
  onClick: () => void;
}

export const AppTag: FunctionComponent<AppTagProps> = ({
  color = "grey" as TagTypeName,
  name,
  onClick,
}) => {
  return (
    <Tag
      type={color}
      key={name}
      onClick={onClick}
      style={{ marginLeft: 8, outline: 0 }}
    >
      {name}
    </Tag>
  );
};
