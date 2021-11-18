import { useAppSelector as selector } from '../../app/hooks'

import Notification from './Notification'

const Notifications = () => {
  const allNotifications = Object.values(selector(state => state.notifications))
  const userAddress = selector(state => state.wallet.address)

  if (userAddress === null || allNotifications.length === 0) return null

  return (
    <div style={{ position: 'absolute', right: 16, top: 16 }}>
      {Object.values(allNotifications)
        .sort((a, b) => a.startTimeMS - b.startTimeMS)
        .filter(notif => notif.userAddress === userAddress)
        .map(notif => <Notification key={notif.uid} notif={notif} /> )
      }
    </div>
  )
}

export default Notifications
