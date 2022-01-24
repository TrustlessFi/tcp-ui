import { PayloadAction } from '@reduxjs/toolkit'
import { createLocalSlice } from '../'
import { RootState } from '../fetchNodes'
import { toChecksumAddress } from '../../utils/'

const initialState = null as string | null

const userAddressSlice = createLocalSlice({
  name: 'userAddress',
  initialState,
  stateSelector: (state: RootState) => state.userAddress,
  reducers: {
    userAddressFound: (_state, action: PayloadAction<string | null>) => {
      const address = action.payload
      return address === null ? null : toChecksumAddress(address)
    },
  }
})

export const { userAddressFound } = userAddressSlice.slice.actions

export default userAddressSlice
