import { SerializedError, AsyncThunk, Draft, ActionReducerMapBuilder } from '@reduxjs/toolkit'

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

export const getInitialStateCopy = <T>(): sliceState<T> => JSON.parse(JSON.stringify(initialState))

export const getSliceStateLoading = <T>(): sliceState<T> => {
  const result = JSON.parse(JSON.stringify(initialState))
  result.loading = true
  return result
}

export const getSliceStateError = <T>(error: SerializedError): sliceState<T> => {
  const result = JSON.parse(JSON.stringify(initialState))
  result.data.error = error
  return result
}

export const getSliceState = <T>(data: T): sliceState<T> => {
  const result = JSON.parse(JSON.stringify(initialState))
  result.data.value = data
  return result
}

export const getStateWithValue = <T>(value: T | null): sliceState<T> => {
  const state = getInitialStateCopy<T>()
  state.value = value
  return state
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
