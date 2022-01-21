import { SerializedError, AsyncThunk, Draft, ActionReducerMapBuilder } from '@reduxjs/toolkit'
import { timeS } from '../utils'

export interface sliceState<T> {
  loading: boolean
  value: T | null
  error: SerializedError | null
}

export const initialState: sliceState<unknown> = {
  loading: false,
  value: null,
  error: null,
}

export const getNullSliceState = <T>(): sliceState<T> => JSON.parse(JSON.stringify(initialState))

const getStateWithValue = <T>(value: T | null = null): sliceState<T> => {
  const state = getNullSliceState<T>()
  state.value = value
  return state
}

export const getLocalStorageState = <T>(name: string, defaultValue: T): T  => {
  const rawValue = localStorage.getItem(name)

  if (rawValue === null) return defaultValue

  const sliceStateWithExpiration = JSON.parse(rawValue)

  if (sliceStateWithExpiration.expiration < timeS()) {
    localStorage.removeItem(name)
    return defaultValue
  }

  return sliceStateWithExpiration.sliceState
}

export const getLocalStorageSliceState = <T>(name: string): sliceState<T> =>
  getStateWithValue(getLocalStorageState(name, null as T | null))

export type NonNullValues<O> = {
  [K in keyof O]-?: NonNullable<O[K]>
}

export const getGenericReducerBuilder = <Args extends {}, Value>(
  builder: ActionReducerMapBuilder<sliceState<Value>>,
  thunk: AsyncThunk<Draft<Value>, Args, {}>,
): ActionReducerMapBuilder<sliceState<Value>> =>  {
  return builder
    .addCase(thunk.pending, (state) => {
      state.loading = true
    })
    .addCase(thunk.rejected, (state, action) => {
      state.loading = false
      state.error = action.error
    })
    .addCase(thunk.fulfilled, (state, action) => {
      state.loading = false
      state.value = action.payload
    })
}
