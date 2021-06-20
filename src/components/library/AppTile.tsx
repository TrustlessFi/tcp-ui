import { CSSProperties, ReactNode } from "react";
import { Tile } from "carbon-components-react";

interface AppTile {
  className?: string
  title: string
  style?: CSSProperties
  children: ReactNode
}

export default ({className, title, style, children}: AppTile ) => (
  <Tile style={{ margin: 2, ...style }} className={className}>
    <span style={{fontSize: 24}}>{title}</span>
    <div style={{marginTop: 12, marginBottom: 12}}>
      {children}
    </div>
  </Tile>
)
