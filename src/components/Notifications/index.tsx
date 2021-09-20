import { useDispatch } from 'react-redux'
import { useAppSelector as selector } from '../../app/hooks'
import { notificationClosed } from '../../slices/notifications'

import Notification from './Notification'

const NOTIFICATION_DURATION_SECONDS = 12

export default ({}) => {
  const dispatch = useDispatch()
  const notificationMap = selector(state => state.notifications)

  const onClose = (hash: string) => dispatch(notificationClosed(hash))

  const orderedNotifications = Object.values(notificationMap).sort((a, b) => a.nonce - b.nonce)

  return (
    <div style={{
      position: 'absolute',
      right: 16,
      top: 16
    }}>
      {orderedNotifications.map(notification =>
        <Notification
          key={notification.hash}
          data={notification}
          durationSeconds={NOTIFICATION_DURATION_SECONDS}
          onClose={() => onClose(notification.hash)}
        />
      )}
    </div>
  )
}
