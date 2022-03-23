import { ReactNode, CSSProperties } from "react"
import Breadcrumbs, { BreadcrumbItemType } from '../library/Breadcrumbs'
import RelativeLoading from '../library/RelativeLoading'
import { UI_VERSION } from '../../constants'

const OneColumnDisplay = ({
  columnOne,
  loading,
  breadCrumbItems,
  light,
  innerStyle,
}:{
  columnOne: ReactNode // TODO make this a child
  loading?: boolean
  breadCrumbItems?:  BreadcrumbItemType[]
  light?: boolean
  innerStyle?: CSSProperties
}) => {
  return (
    <div style={{ position: 'relative' }}>
      <RelativeLoading light={light} show={loading === true} />
      <div style={{ width: 500, margin: '0 auto', float: 'none' }}>
        {
          UI_VERSION === 1
          ? <Breadcrumbs crumbs={breadCrumbItems} />
          : null
        }
        <div style={{position: 'relative', ...innerStyle}}>
          {columnOne}
        </div>
      </div>
    </div>
  )
}

export default OneColumnDisplay
