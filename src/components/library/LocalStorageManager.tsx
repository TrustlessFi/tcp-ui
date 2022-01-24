import { useAppSelector as selector } from '../../app/hooks'
import { RootState } from '../../slices/fetchNodes'
import allSlices from '../../slices/allSlices'
import { sliceState, CacheDuration, SliceDataType } from '../../slices'
import { timeS } from '../../utils'

const year2120 = 4733539200

const LocalStorageManager = () => {
  Object.values(allSlices).map(slice => {
    const rawState = selector(slice.stateSelector as (state: RootState) => sliceState<unknown>)
    const sliceState = slice.sliceType === SliceDataType.ChainData ? rawState.value : rawState
    if (sliceState !== null && slice.cacheDuration !== CacheDuration.NONE) {
      const expiration = slice.cacheDuration === CacheDuration.INFINITE ? year2120 : timeS() + slice.cacheDuration
      const stateWithTimestamp = { expiration, sliceState }
      localStorage.setItem(slice.name, JSON.stringify(stateWithTimestamp))
    }
  })
  return <></>
}

export const clearEphemeralStorage = () =>
  Object.values(allSlices)
    .filter(slice => slice.cacheDuration !== CacheDuration.INFINITE)
    .map(slice => localStorage.removeItem(slice.name))

export default LocalStorageManager
