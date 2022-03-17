import { useAppSelector as selector } from '../../app/hooks'

import Notification from './Notification'

const Notifications = () => {
  const allNotifications = Object.values(selector(state => state.notifications))
  const userAddress = selector(state => state.userAddress)
  const chainID = selector(state => state.chainID)

  if (
    allNotifications.length === 0 ||
    userAddress === null ||
    chainID === null
  ) return null

  return (
    <div style={{ position: 'fixed', right: 16, top: 63, zIndex: 10000 }}>
      {Object.values(allNotifications)
        .filter(notif => notif.userAddress === userAddress)
        .filter(notif => notif.chainID === chainID)
        .sort((a, b) => a.startTimeMS - b.startTimeMS)
        .map(notif => <Notification key={notif.uid} notif={notif} /> )
      }
    </div>
  )
}

export default Notifications
