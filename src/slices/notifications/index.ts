import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { v4 as getUid } from 'uuid'
import { timeMS } from '../../utils'
import { getLocalStorageState } from '../'
import { TransactionStatus, TransactionType } from '../transactions'
import { ChainID } from '@trustlessfi/addresses'

export interface notificationArgs {
  hash?: string
  status: TransactionStatus
  userAddress: string
  type: TransactionType
  chainID: ChainID
  message?: string
}

export interface notificationInfo extends notificationArgs {
  startTimeMS: number,
  uid: string,
}

export interface notificationState {[uid: string]: notificationInfo}

const name = 'notifications'

export const notificationsSlice = createSlice({
  name,
  initialState: getLocalStorageState<notificationState>(name, {}),
  reducers: {
    addNotification: (state, action: PayloadAction<notificationArgs>) => {
      const args = action.payload
      const uid = getUid()
      state[uid] = { ...args, startTimeMS: timeMS(), uid }
    },
    notificationClosed: (state, action: PayloadAction<string>) => {
      const uid = action.payload
      return Object.fromEntries(Object.values(state).filter(notif => notif.uid !== uid).map(notif => [notif.uid, notif]))
    },
  }
})

export const { addNotification, notificationClosed } = notificationsSlice.actions

export default notificationsSlice.reducer
