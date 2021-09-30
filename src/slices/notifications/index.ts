import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { TransactionInfo } from '../transactions'
import { timeMS } from '../../utils'
import { getLocalStorage } from '../../utils'
import { TransactionStatus, getTxNonce } from '../transactions'
import { getTxHash } from '../transactions'

export interface notificationInfo extends TransactionInfo {
  startTimeMS: number
}

export type NotificationState = {[key in string]: notificationInfo}

const initialState: NotificationState = {}

const name = 'notifications'

export const notificationsSlice = createSlice({
  name,
  initialState: getLocalStorage(name, initialState) as NotificationState,
  reducers: {
    addNotification: (state, action: PayloadAction<TransactionInfo>) => {
      const tx = action.payload
      if (tx.status !== TransactionStatus.Pending) {
        state[getTxNonce(tx)] = { ...action.payload, startTimeMS: timeMS() }
      }
    },
    notificationClosed: (state, action: PayloadAction<string>) => {
      const hash = action.payload
      return Object.fromEntries(Object.values(state).filter(notif => getTxHash(notif) !== hash).map(notif => [notif.hash, notif]))
    },
  }
})

export const { addNotification, notificationClosed } = notificationsSlice.actions

export default notificationsSlice.reducer
