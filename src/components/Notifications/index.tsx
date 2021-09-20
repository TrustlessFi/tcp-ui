import { useDispatch } from 'react-redux'
import { useAppSelector as selector } from '../../app/hooks'
import { notificationClosed, addNotification, } from '../../slices/notifications'
import { Button } from 'carbon-components-react'
import { TransactionStatus } from '../../slices/transactions'
import { useEffect, useState, useRef } from "react";
import { randomInRange } from '../../utils'

import Notification from './Notification'


export default ({}) => {
  const dispatch = useDispatch()
  const notificationMap = selector(state => state.notifications)

  const orderedNotifications = Object.values(notificationMap).sort((a, b) => a.nonce - b.nonce)

  const renderedNotifications =
    orderedNotifications.map(notification => {
      return (
        <Notification
          key={notification.hash}
          data={notification}
        />
      )
    })

  const nonce = useRef(50)

  const showNotification = () => {
    dispatch(addNotification(
      {
        status: TransactionStatus.Failed,
        message: 'Test notification',
        hash: 'hash' + nonce.current,
        nonce: nonce.current
      }
    ))
    nonce.current = randomInRange(0, 100)
  }

  return (
    <>
      <Button onClick={showNotification}>Show notification</Button>
      <div style={{
        position: 'absolute',
        right: 16,
        top: 16
      }}>
        {renderedNotifications}
      </div>
    </>
  )
}
