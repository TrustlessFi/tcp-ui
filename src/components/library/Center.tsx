import { CSSProperties, ReactNode } from 'react';

const Center = ({ style, children }: { style?: CSSProperties, children: ReactNode }) => (
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
)

export default Center
