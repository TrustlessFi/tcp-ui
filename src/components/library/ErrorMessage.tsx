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

  if (reason === null) return null

  return <LargeText color='#FA4D56'>{reason.message}</LargeText>
}

export default ErrorMessage
