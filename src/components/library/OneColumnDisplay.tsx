import { ReactNode } from "react"
import Breadcrumbs, { BreadcrumbItemType } from '../library/Breadcrumbs'
import RelativeLoading from '../library/RelativeLoading'
import { UI_VERSION } from '../../constants'

const OneColumnDisplay = ({
  columnOne,
  loading,
  breadCrumbItems,
  light,
}:{
  columnOne: ReactNode
  loading: boolean
  breadCrumbItems?:  BreadcrumbItemType[]
  light?: boolean
}) => {
  return (
    <div style={{ position: 'relative' }}>
      <RelativeLoading light={light} show={loading} />
      <div style={{ width: 500, margin: '0 auto', float: 'none' }}>
        {
          UI_VERSION === 1
          ? <Breadcrumbs crumbs={breadCrumbItems} />
          : null
        }
        <div style={{marginTop: 64}}>
          {columnOne}
        </div>
      </div>
    </div>
  )
}

export default OneColumnDisplay
