import { useAppSelector as selector } from '../../app/hooks'
import { RootState, allSlices } from '../../slices/fetchNodes'
import { sliceState, CacheDuration } from '../../slices'
import { timeS } from '../../utils'

const year2120 = 4733539200

const LocalStorageManager = () => {
  Object.values(allSlices).map(slice => {
    const sliceState = selector(slice.stateSelector as (state: RootState) => sliceState<unknown>).value
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
