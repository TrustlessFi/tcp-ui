import { PayloadAction } from '@reduxjs/toolkit'
import { createLocalSlice } from '../'
import { RootState } from '../../app/store'
import { toChecksumAddress } from '../../utils/'

const initialState = null as string | null

const partialUserAddressSlice = createLocalSlice({
  name: 'userAddress',
  initialState,
  reducers: {
    userAddressFound: (_state, action: PayloadAction<string | null>) => {
      const address = action.payload
      return address === null ? null : toChecksumAddress(address)
    },
  }
})

export const userAddressSlice = {
  ...partialUserAddressSlice,
  stateSelector: (state: RootState) => state.userAddress
}

export const { userAddressFound } = partialUserAddressSlice.slice.actions

export default partialUserAddressSlice.slice.reducer
