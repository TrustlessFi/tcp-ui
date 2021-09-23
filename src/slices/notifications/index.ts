import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { TransactionInfo } from '../transactions/index';
import { timeMS } from '../../utils'
import { getLocalStorage } from '../../utils/index';

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
