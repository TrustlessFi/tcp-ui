import { Loading } from 'carbon-components-react'

const RelativeLoading = ({show}: {show: boolean} ) => (
  show ? (
    <div style={{
      position: 'absolute',
      display: 'flex',
      width: '100%',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(22, 22, 22, 0.7)',
      zIndex: 6000,
      transition: 'background-color 720ms cubic-bezier(0.4, 0.14, 0.3, 1)',
    }}>
      <Loading withOverlay={false} small />
    </div>
  ) : null
)

export default RelativeLoading
