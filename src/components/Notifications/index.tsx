import { useDispatch } from 'react-redux'
import { useAppSelector as selector } from '../../app/hooks'
import { addNotification, } from '../../slices/notifications'
import { Button } from 'carbon-components-react'
import { TransactionStatus } from '../../slices/transactions'
import { useRef } from "react";
import { randomInRange } from '../../utils'

import Notification from './Notification'
import { TransactionType } from '../../slices/transactions/index';


export default ({}) => {
  const dispatch = useDispatch()

  const rawNotifications = Object.values(selector(state => state.notifications))
  const userAddress = selector(state => state.wallet.address)
  const nonce = useRef(50)

  if (userAddress === null || rawNotifications.length === 0) return null

  const renderedNotifications =
    Object.values(rawNotifications)
      .sort((a, b) => a.nonce - b.nonce)
      .filter(notification => notification.userAddress === userAddress)
      .map(notification => {
        return (
          <Notification
            key={notification.hash}
            data={notification}
          />
        )
      })

      // TODO remove
  const showNotification = () => {
    dispatch(addNotification(
      {
        status: TransactionStatus.Failed,
        message: 'Test notification',
        hash: 'hash' + nonce.current,
        nonce: nonce.current,
        userAddress: nonce.current > 50 ? '0xaC5e1ccc84169A5Aa4c386EAE98c7CA863FEE6Bf' : '0xa02E38C515Ac3DCDBC18C69303700fa8cb839949',
        type: TransactionType.CreatePosition,
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
