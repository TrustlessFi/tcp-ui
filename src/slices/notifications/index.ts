import { PayloadAction } from '@reduxjs/toolkit'
import { v4 as getUid } from 'uuid'
import { timeMS } from '../../utils'
import { TransactionStatus, TransactionType } from '../transactions'
import { ChainID } from '@trustlessfi/addresses'
import { createLocalSlice, CacheDuration } from '../'
import { RootState } from '../../app/store'

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


const partialNotificationsSlice = createLocalSlice({
  name: 'notifications',
  initialState: {} as notificationState,
  cacheDuration: CacheDuration.INFINITE,
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

export const notificationsSlice = {
  ...partialNotificationsSlice,
  stateSelector: (state: RootState) => state.chainID
}

export const { addNotification, notificationClosed } = partialNotificationsSlice.slice.actions

export default partialNotificationsSlice.slice.reducer
