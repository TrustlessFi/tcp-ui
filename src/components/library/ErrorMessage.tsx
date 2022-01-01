import LargeText from '../library/LargeText'
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

  const message = reason === null ? ' ' : reason.message

  return (
    <div style={{height: 32, color: '#FA4D56'}}>
      {
        large
        ? <LargeText>{message}</LargeText>
        : <>{message}</>
      }
    </div>
  )
}
ErrorMessage.defaultProps = {
  large: true
}

export default ErrorMessage
