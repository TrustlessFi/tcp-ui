import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { TransactionStatus } from '../transactions/index';
import { timeMS } from '../../utils'
import { getLocalStorage } from '../../utils/index';

export type notificationData = {
  status: TransactionStatus,
  userAddress: string,
  message: string,
  hash: string,
  nonce: number
}

export interface notificationInfo extends notificationData {
  startTimeMS: number
}

export type NotificationState = {[key in string]: notificationInfo}

const initialState: NotificationState = {}

const name = 'notifications'

export const notificationsSlice = createSlice({
  name,
  initialState: getLocalStorage(name, initialState) as NotificationState,
  reducers: {
    addNotification: (state, action: PayloadAction<notificationData>) => {
      const notification = action.payload
      state[notification.hash] = { ...notification, startTimeMS: timeMS() }
    },
    notificationClosed: (state, action: PayloadAction<string>) => {
      const hash = action.payload
      if (state.hasOwnProperty(hash)) delete state[hash]
    },
  }
})

export const { addNotification, notificationClosed } = notificationsSlice.actions

export default notificationsSlice.reducer
