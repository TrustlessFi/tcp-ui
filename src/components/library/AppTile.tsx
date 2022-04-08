import { CSSProperties, ReactNode } from "react"
import { Tile } from "carbon-components-react"
import ErrorBoundary from './ErrorBoundary'
import LargeText from '../library/LargeText'

interface AppTileProps {
  className?: string
  title: string
  style?: CSSProperties
  children: ReactNode
  rightElement?: ReactNode
  subTitle?: ReactNode
}

const AppTile = ({className, title, style, children, rightElement, subTitle}: AppTileProps ) => (
  <ErrorBoundary>
    <Tile style={{ minWidth: 550, padding: 0, ...style }} className={className}>
      <div style={{display: 'flex', alignItems: 'center', height: 68, paddingLeft: 40, paddingRight: 10}} >
        <div>
          <LargeText>{title}</LargeText>
          {subTitle ? <div style={{marginTop: 4}}>{subTitle}</div> : null}
        </div>
        {rightElement === undefined ? null : (
          <span style={{marginLeft: 'auto'}}>{rightElement}</span>
        )}
      </div>
      {children}
    </Tile>
  </ErrorBoundary>
)

export default AppTile
