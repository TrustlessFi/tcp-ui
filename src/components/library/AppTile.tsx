import { CSSProperties, ReactNode } from "react";
import { Tile } from "carbon-components-react";
import ErrorBoundary from './ErrorBoundary'
import LargeText from '../utils/LargeText';
import { Row, Col } from 'react-flexbox-grid'

interface AppTileProps {
  className?: string
  title: string
  style?: CSSProperties
  children: ReactNode
  rightElement?: ReactNode
}

const AppTile = ({className, title, style, children, rightElement}: AppTileProps ) => (
  <ErrorBoundary>
    <Tile style={{ ...style  }} className={className}>
      <div style={{display: 'flex', alignItems: 'center', height: 36, paddingLeft: 16, marginBottom: 24}} >
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
