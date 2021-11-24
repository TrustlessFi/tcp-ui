import { ReactNode } from "react"
import Breadcrumbs, { BreadcrumbItem } from '../library/Breadcrumbs'
import RelativeLoading from '../library/RelativeLoading'
import { Row, Col } from 'react-flexbox-grid'
import useWindowWidth  from '../../hooks/useWindowWidth'

const TwoColumnDisplay = ({
  columnOne,
  columnTwo,
  loading,
  breadCrumbItems,
}:{
  columnOne: ReactNode
  columnTwo: ReactNode
  loading: boolean
  breadCrumbItems:  BreadcrumbItem[]
}) => {
  const isSmallViewport = useWindowWidth()

  return (
    <div style={{position: 'relative'}}>
      {breadCrumbItems.length === 0
        ? null
        : <Breadcrumbs items={[{ text: 'Positions', href: '/' }, 'New']} />
      }
      <RelativeLoading show={loading} />
      {
        isSmallViewport
        ? columnOne
        : <Row middle='xs'>
            <Col xs={4}>
              {columnOne}
            </Col>
            <Col xs={8}>
              {columnTwo}
            </Col>
          </Row>
      }
    </div>
  )
}

export default TwoColumnDisplay
