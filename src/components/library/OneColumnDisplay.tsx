import { ReactNode, CSSProperties } from "react"
import RelativeLoading from '../library/RelativeLoading'
import { isMobile } from 'react-device-detect'

const OneColumnDisplay = ({
  columnOne,
  loading,
  light,
  innerStyle,
  style,
}:{
  columnOne: ReactNode // TODO make this a child
  loading?: boolean
  light?: boolean
  innerStyle?: CSSProperties
  style?: CSSProperties
}) => {
  return (
    <div style={{ position: 'relative', ...style }}>
      <RelativeLoading light={light} show={loading === true} />
      <div style={{
        width: isMobile ? '100%' : '500px',
        margin: '0 auto',
        float: 'none',
        ...innerStyle }}>
        {columnOne}
      </div>
    </div>
  )
}

export default OneColumnDisplay
