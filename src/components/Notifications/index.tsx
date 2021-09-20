import { useDispatch } from 'react-redux'
import { ToastNotification } from 'carbon-components-react'
import { useAppSelector as selector } from '../../app/hooks'
import { notificationClosed } from '../../slices/notifications'

import Notification from './Notification'

const NOTIFICATION_DURATION_SECONDS = 10

export default ({}) => {
  const dispatch = useDispatch()
  const notificationMap = selector(state => state.notifications)

  const orderedNotifications = Object.values(notificationMap).sort((a, b) => a.nonce - b.nonce)

  const onClose = (hash: string) => dispatch(notificationClosed(hash))

  return (
    <div style={{
      position: 'absolute',
      right: 16,
      top: 16
    }}>
      {orderedNotifications.map(notification =>
        <Notification
          data={notification}
          durationSeconds={NOTIFICATION_DURATION_SECONDS}
          onClose={() => onClose(notification.hash)}
        />
      )}
      <ToastNotification
        lowContrast
        style={{top: '24px', height: '150px', bottom: undefined}}
        caption="00:00:00 AM"
        kind="warning"
        iconDescription="describes the close button"
        subtitle={<span>Subtitle text goes here. <a href="#example">Example link</a></span>}
        title="Notification title"
      />
    </div>
  )
}
