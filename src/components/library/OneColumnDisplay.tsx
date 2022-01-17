import { ReactNode } from "react"
import Breadcrumbs, { BreadcrumbItemType } from '../library/Breadcrumbs'
import RelativeLoading from '../library/RelativeLoading'

const OneColumnDisplay = ({
  columnOne,
  columnTwo,
  loading,
  breadCrumbItems,
}:{
  columnOne: ReactNode
  columnTwo?: ReactNode
  loading: boolean
  breadCrumbItems?:  BreadcrumbItemType[]
}) => {
  return (
    <div style={{position: 'relative', }}>
      <RelativeLoading show={loading} />
      <div style={{ width: 500, margin: '0 auto', float: 'none' }}>
        <div style={{marginBottom: 64}}>
          <Breadcrumbs crumbs={breadCrumbItems} />
        </div>
        {columnOne}
        {columnTwo}
      </div>
    </div>
  )
}

export default OneColumnDisplay
