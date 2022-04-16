import { ReactNode, CSSProperties } from "react"
import RelativeLoading from '../library/RelativeLoading'

const OneColumnDisplay = ({
  columnOne,
  loading,
  light,
  innerStyle,
}:{
  columnOne: ReactNode // TODO make this a child
  loading?: boolean
  light?: boolean
  innerStyle?: CSSProperties
}) => {
  return (
    <div style={{ position: 'relative' }}>
      <RelativeLoading light={light} show={loading === true} />
      <div style={{ width: 500, margin: '0 auto', float: 'none' }}>
        <div style={{position: 'relative', ...innerStyle}}>
          {columnOne}
        </div>
      </div>
    </div>
  )
}

export default OneColumnDisplay
