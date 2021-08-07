import { CSSProperties, ReactNode } from "react";
import { Tile } from "carbon-components-react";
import ErrorBoundary from './ErrorBoundary'

interface AppTileProps {
  className?: string
  title: string
  style?: CSSProperties
  children: ReactNode
}

export default ({className, title, style, children}: AppTileProps ) => (
  <Tile style={{ margin: 2, ...style }} className={className}>
    <span style={{fontSize: 24}}>{title}</span>
    <ErrorBoundary>
      <div style={{marginTop: 12, marginBottom: 12}}>
        {children}
      </div>
    </ErrorBoundary>
  </Tile>
)
