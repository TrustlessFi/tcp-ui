import { CSSProperties, ReactNode } from "react";
import { Tile } from "carbon-components-react";
import ErrorBoundary from './ErrorBoundary'
import LargeText from '../utils/LargeText';

interface AppTileProps {
  className?: string
  title: string
  style?: CSSProperties
  children: ReactNode
  rightElement?: ReactNode
}

const AppTile = ({className, title, style, children, rightElement}: AppTileProps ) => (
  <ErrorBoundary>
    <Tile style={{ ...style, padding: 0  }} className={className}>
      <div style={{display: 'flex', alignItems: 'center', height: 68, paddingLeft: 32, paddingRight: 12}} >
        <LargeText>{title}</LargeText>
        {rightElement === undefined ? null : (
          <span style={{marginLeft: 'auto'}}>{rightElement}</span>
        )}
      </div>
      {children}
    </Tile>
  </ErrorBoundary>
)

export default AppTile
