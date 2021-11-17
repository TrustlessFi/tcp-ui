import LargeText from '../utils/LargeText'
import { firstOrNull }  from '../../utils/'

export type reason = {
  message: string
  failing: boolean
  silent?: boolean
}

const ErrorMessage = ({
  reasons,
}: {
  reasons: reason[],
}) => {
  const reason = firstOrNull(reasons.filter((reason) => reason.failing && reason.silent !== true))

  return (
    <div style={{height: 32}}>
      <LargeText color='#FA4D56'>{reason === null ? ' ' : reason.message}</LargeText>
    </div>
  )
}

export default ErrorMessage
