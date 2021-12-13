import LargeText from '../utils/LargeText'
import { firstOrNull }  from '../../utils/'

export type reason = {
  message: string
  failing: boolean
  silent?: boolean
}

const ErrorMessage = ({
  reasons,
  large,
}: {
  reasons: reason[],
  large: boolean
}) => {
  const reason = firstOrNull(reasons.filter((reason) => reason.failing && reason.silent !== true))

  if (reason === null) return null

  return (
    <div style={{height: 32, color: '#FA4D56'}}>
      {
        large
        ? <LargeText>{reason.message}</LargeText>
        : <>{reason.message}</>
      }
    </div>
  )
}
ErrorMessage.defaultProps = {
  large: true
}

export default ErrorMessage
