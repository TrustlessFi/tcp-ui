import { CSSProperties, ReactNode } from "react";
import { Tile } from "carbon-components-react";
import ErrorBoundary from './ErrorBoundary'

interface AppTileProps {
  className?: string
  title: string
  style?: CSSProperties
  children: ReactNode
  rightElement?: ReactNode
}

const AppTile = ({className, title, style, children, rightElement}: AppTileProps ) => (
  <ErrorBoundary>
    <Tile style={{ margin: 2, ...style }} className={className}>
      <span style={{fontSize: 24}}>
        {title}
      </span>
      <span style={{float: 'right'}}>
        {rightElement}
      </span>
      <div style={{marginTop: 12, marginBottom: 12}}>
        {children}
      </div>
    </Tile>
  </ErrorBoundary>
)

export default AppTile
