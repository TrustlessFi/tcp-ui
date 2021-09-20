import { useDispatch } from 'react-redux'
import {
  ToastNotification,
  ProgressIndicator,
} from 'carbon-components-react'
import { TransactionStatus } from '../../slices/transactions'
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import { notificationClosed } from '../../slices/notifications'

import Notification from './Notification'

export default ({}) => {
  const dispatch = useDispatch()
  const notificationMap = selector(state => state.notifications)

  const orderedNotifications = Object.values(notificationMap).sort((a, b) => a.nonce - b.nonce)

  const onClose = (hash: string) => dispatch(notificationClosed(hash))


  return (
    <div style={{marginLeft: '24px'}}>
      {orderedNotifications.map(notification =>
        <Notification data={notification} onClose={() => onClose(notification.hash)} />
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
