import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { TransactionStatus } from '../transactions/index';

export type notificationData = {
  status: TransactionStatus,
  message: string,
  hash: string,
  nonce: number
}

export type NotificationState = {[key in string]: notificationData}

const initialState: NotificationState = {}

const name = 'notifications'

export const notificationsSlice = createSlice({
  name,
  initialState: initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<notificationData>) => {
      const notification = action.payload
      state[notification.hash] = notification
    },
    notificationClosed: (state, action: PayloadAction<string>) => {
      const hash = action.payload
      if (state.hasOwnProperty(hash)) delete state[hash]
    },
  }
})

export const { addNotification, notificationClosed } = notificationsSlice.actions

export default notificationsSlice.reducer
