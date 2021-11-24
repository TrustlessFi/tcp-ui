import { Row, Col } from 'react-flexbox-grid'
import Text from '../utils/Text'

export interface metadata {
  value: string,
  title: string,
  failing?: boolean
}

const PositionMetadata2 = ({items}: { items: metadata[]}) => {

  const getColor = (isFailing?: boolean) => isFailing ? '#FA4D56' : '#f4f4f4'

  const border = '1px solid #404040'
  const style = {margin: 0, paddingTop: 8, paddingBottom: 8}

  const rows = items.map((item, index, array) => (
    <Row key={item.title} style={index === array.length - 1 ? style : {...style, borderBottom: border}}>
      <Text monospace size={14} lineHeight="16px" color={getColor(item.failing)} bold>{item.value}</Text>
      <Text monospace size={14} lineHeight="16px" color={getColor(item.failing)} style={{marginLeft: 8}}>{item.title}</Text>
    </Row>
  ))

  return <Col>{rows}</Col>
}

export default PositionMetadata2
