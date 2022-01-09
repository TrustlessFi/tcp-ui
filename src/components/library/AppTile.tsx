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
    <Tile style={{ ...style, height: 'default', padding: 0  }} className={className}>
      <div style={{display: 'flex', alignItems: 'center', paddingLeft: 32, paddingRight: 12}} >
        <div style={{marginRight: rightElement ? '1rem' : '0px'}}>
          <LargeText>{title}</LargeText>
          {subTitle ? <div style={{marginTop: 4}}>{subTitle}</div> : null}
        </div>
        {rightElement && (
          <span style={{marginLeft: 'auto'}}>{rightElement}</span>
        )}
      </div>
      {children}
    </Tile>
  </ErrorBoundary>
)

export default AppTile
