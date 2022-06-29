import { AppDispatch } from '../../app/store'
import allSlices from '../../slices/allSlices'
import { SliceDataType, CacheDuration } from '../../slices/'

export const clearUserData = (dispatch: AppDispatch) =>
  Object.values(allSlices)
    .filter(slice => slice.sliceType === SliceDataType.ChainUserData || slice.sliceType === SliceDataType.LocalUserData)
      .map(slice => dispatch(slice.slice.actions.clearData()))

export const clearEphemeralStorage = () =>
  Object.values(allSlices)
    .filter(slice => slice.cacheDuration !== CacheDuration.INFINITE)
      .map(slice => localStorage.removeItem(slice.name))

export const clearAllStorage = (dispatch: AppDispatch) =>
  Object.values(allSlices)
    .map(slice => dispatch(slice.slice.actions.clearData()))
