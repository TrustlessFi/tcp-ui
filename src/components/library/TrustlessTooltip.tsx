import { useState, CSSProperties } from 'react'
import { Information16 } from '@carbon/icons-react'
import { Tile } from 'carbon-components-react'

export const TrustlessTooltip = ({
  text,
  style,
}: {
  text: string
  style?: CSSProperties
}) => {
  const [isActive, setIsActive]  = useState(false)

  return (
    <div
      style={{position: 'relative', display: 'inline-block', cursor: 'pointer'}}
      onMouseEnter={() => setIsActive(true)}
      onMouseLeave={() => setIsActive(false)} >
      <Information16 width={15} style={{opacity: '80%'}} />
      {
        isActive
        ? <Tile
          light
          style={{
            position: 'absolute',
            top: '-100%',
            left: '125%',
            zIndex: 10000,
            ...style,
          }}>
            <div style={{width: 300,lineHeight: 1.5}}>
              {text}
            </div>
          </Tile>
        : null
      }
    </div>
  )
}

export default TrustlessTooltip
