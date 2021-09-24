import { Row, Col } from 'react-flexbox-grid'
import Text from '../../utils/Text'


const PositionMetadata = ({items}: { items: {value: string, title: string, failing?: boolean}[]}) => {
  const border = '2px solid #161616'

  const getColor = (isFailing?: boolean) => isFailing ? '#FA4D56' : '#8D8D8D'

  const valuesView = items.map((item, index) => {
    return (
      <Col xs key={"PositionMetadata " + index}>
        <div>
          <Text monospace size={14} lineHeight="18px" color={getColor(item.failing)} bold>{item.value}</Text>
        </div>
        <div>
          <Text monospace size={14} lineHeight="18px" color={getColor(item.failing)}>{item.title}</Text>
        </div>
      </Col>
    )
  })

  return (
    <Row style={{
      borderTop: border,
      borderBottom: border,
      paddingTop: 16,
      paddingBottom: 12,
      paddingLeft: 12,
      paddingRight: 12,
    }}>
      {valuesView}
    </Row>
  )
}

export default PositionMetadata
