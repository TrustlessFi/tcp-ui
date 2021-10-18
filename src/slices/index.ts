import { SerializedError, AsyncThunk, Draft } from '@reduxjs/toolkit';
import { ActionReducerMapBuilder } from '@reduxjs/toolkit';

export interface sliceState<T> {
  loading: boolean
  data: {
    error: SerializedError | null
    value: T | null
  }
  write: {
    waitingForUser: boolean
    hash: string
    error: SerializedError | null
  }
}

export const initialState: sliceState<any> = {
  loading: false,
  data: {
    error: null,
    value: null,
  },
  write: {
    waitingForUser: false,
    hash: '',
    error: null,
  }
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
  state.data.value = value
  return state
}

export const getGenericWriteReducerBuilder = <Args extends {}, Value>(
  builder: ActionReducerMapBuilder<sliceState<Value>>,
  thunk: AsyncThunk<string, Args, {}>,
): ActionReducerMapBuilder<any> =>  {
  return builder
    .addCase(thunk.pending, (state) => {
      state.write = {
        waitingForUser: true,
        hash: '',
        error: null,
      }
    })
    .addCase(thunk.rejected, (state, action) => {
      state.write = {
        waitingForUser: false,
        hash: '',
        error: action.error,
      }
    })
    .addCase(thunk.fulfilled, (state, action) => {
      state.write = {
        waitingForUser: false,
        hash: action.payload,
        error: null,
      }
    })
}

export const getGenericReducerBuilder = <Args extends {}, Value>(
  builder: ActionReducerMapBuilder<sliceState<Value>>,
  thunk: AsyncThunk<Draft<Value>, Args, {}>,
): ActionReducerMapBuilder<any> =>  {
  // TODO replace any with sliceState<Value>
  return builder
    .addCase(thunk.pending, (state) => {
      state.loading = true
    })
    .addCase(thunk.rejected, (state, action) => {
      state.loading = false
      state.data.error = action.error
    })
    .addCase(thunk.fulfilled, (state, action) => {
      state.loading = false
      state.data.value = action.payload
    })
}
