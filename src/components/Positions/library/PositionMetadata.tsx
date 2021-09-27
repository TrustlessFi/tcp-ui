import { Row, Col } from 'react-flexbox-grid'
import Text from '../../utils/Text'

type metadata = {value: string, title: string, failing?: boolean}


const Metadata = ({item}: {item: metadata}) => {
  const getColor = (isFailing?: boolean) => isFailing ? '#FA4D56' : '#8D8D8D'

  return (
    <>
      <Row key={item.value + '0'}>
        <Text monospace size={14} lineHeight="18px" color={getColor(item.failing)} bold>{item.value}</Text>
      </Row>
      <Row key={item.value + '1'}>
        <Text monospace size={14} lineHeight="18px" color={getColor(item.failing)}>{item.title}</Text>
      </Row>
    </>
  )
}

const PositionMetadata = ({items}: { items: metadata[]}) => {
  const border = '1px solid #404040'

  const rows: metadata[][] = []
  console.log({rows})

  for(let i = 0; i < items.length;) {
    const itemsInRow: metadata[] = []
    for(let j = 0; j < 4 && i < items.length;) {
      itemsInRow.push(items[i])
      i++
      j++
    }
    rows.push(itemsInRow)
  }

  return (
    <Col style={{
      borderTop: border,
      borderBottom: border,
      paddingTop: 16,
      paddingBottom: 12,
      paddingLeft: 12,
      paddingRight: 12,
    }}>
      {rows.map((row, i0) => (
          <Row key={i0} style={i0 > 0 ? {marginTop: 8} : {}}>
            {row.map((item, i1) => <Col key={i1} xs={3}><Metadata item={item} /></Col>)}
          </Row>
        )
      )}
    </Col>
  )
}

export default PositionMetadata
