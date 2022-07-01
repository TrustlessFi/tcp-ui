import { useState, CSSProperties } from 'react'
import { Information16 } from '@carbon/icons-react'
import { Tile } from 'carbon-components-react'
import { isMobile } from 'react-device-detect'
import { timeMS } from '../../utils/'

export const TrustlessTooltip = ({
  text,
  style,
}: {
  text: string
  style?: CSSProperties
}) => {
  const [isActive, setIsActive] = useState(false)
  const [lastOpen, setLastOpen] = useState(0)

  const TAP_BUFFER = 250

  const updateActive = (activeNext: boolean) => {
    if (isMobile) {
      if (activeNext) setLastOpen(timeMS())
      else if (timeMS() - TAP_BUFFER < lastOpen) return
    }
    setIsActive(activeNext)
  }

  return (
    <div
      style={{position: 'relative', display: 'inline-block', cursor: 'pointer'}}
      onClick={(e) => {
        e.stopPropagation()
        updateActive(!isActive)
      }}
      onMouseEnter={() => updateActive(true)}
      onMouseLeave={() => updateActive(false)} >
      <Information16 width={15} style={{opacity: '80%'}} />
      {
        isActive
        ? <Tile
          light
          style={{
            position: 'absolute',
            top: '125%',
            left: '-125%',
            zIndex: 10000,
            ...style,
          }}>
            <div style={{width: 250,lineHeight: 1.5}}>
              {text}
            </div>
          </Tile>
        : null
      }
    </div>
  )
}

export default TrustlessTooltip
