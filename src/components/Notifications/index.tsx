import { useAppSelector as selector } from '../../app/hooks'
import { getTxNonce, getTxHash } from '../../slices/transactions'

import Notification from './Notification'

const Notifications = () => {
  const allNotifications = Object.values(selector(state => state.notifications))
  const userAddress = selector(state => state.wallet.address)

  if (userAddress === null || allNotifications.length === 0) return null

  const renderedNotifications =
    Object.values(allNotifications)
      .sort((a, b) => getTxNonce(a) - getTxNonce(b))
      .filter(notification => notification.userAddress === userAddress)
      .map(notification => {
        return (
          <Notification
            key={getTxHash(notification)}
            data={notification}
          />
        )
      })
  return (
    <div style={{ position: 'absolute', right: 16, top: 16 }}>
      {renderedNotifications}
    </div>
  )
}

export default Notifications
