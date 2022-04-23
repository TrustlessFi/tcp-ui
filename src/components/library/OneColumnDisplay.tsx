import { ReactNode, CSSProperties } from "react"
import RelativeLoading from '../library/RelativeLoading'
import SpacedList from '../library/SpacedList'
import { isMobile } from 'react-device-detect'

const OneColumnDisplay = ({
  loading,
  light,
  innerStyle,
  style,
  childSpacing,
  children,
}:{
  loading?: boolean
  light?: boolean
  innerStyle?: CSSProperties
  style?: CSSProperties
  childSpacing?: number
  children: ReactNode | ReactNode[]
}) => {
  return (
    <div style={{ position: 'relative', ...style }}>
      <RelativeLoading light={light} show={loading === true} />
      <div style={{
        width: isMobile ? '100%' : '500px',
        margin: '0 auto',
        float: 'none',
        ...innerStyle }}>
        {
          Array.isArray(children)
          ? <SpacedList spacing={childSpacing === undefined ? 20 : childSpacing}>
              {children}
            </SpacedList>
          : children
        }
      </div>
    </div>
  )
}

export default OneColumnDisplay
