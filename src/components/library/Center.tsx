import React from 'react';

export default ({
  style,
  children
}: {
  style?: React.CSSProperties,
  children: React.ReactNode
}) => {

  return (
    <div style={{
      alignContent: 'center',
      alignItems: 'center',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'nowrap',
      justifyContent: 'center',
      ...style
      }}>
      {children}
    </div>
  );
};
