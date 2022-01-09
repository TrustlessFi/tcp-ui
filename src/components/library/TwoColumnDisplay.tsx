import { ReactNode } from "react"
import Breadcrumbs, { BreadcrumbItemType } from '../library/Breadcrumbs'
import RelativeLoading from '../library/RelativeLoading'
import { Row, Col } from 'react-flexbox-grid'

const TwoColumnDisplay = ({
  columnOne,
  columnTwo,
  loading,
  breadCrumbItems,
}:{
  columnOne: ReactNode
  columnTwo: ReactNode
  loading: boolean
  breadCrumbItems?:  BreadcrumbItemType[]
}) => {
  return (
    <div style={{position: 'relative'}}>
      {<Breadcrumbs crumbs={breadCrumbItems} />}
      <RelativeLoading show={loading} />
      <Row middle='xs'>
        <Col xs={12} sm={4}>
          {columnOne}
        </Col>
        <Col sm={8} className='hidden-xs'>
          {columnTwo}
        </Col>
      </Row>
    </div>
  )
}

export default TwoColumnDisplay
