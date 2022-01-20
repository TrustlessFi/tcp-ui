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

/* Utility type for creating an object from an 'Args' type.
 *
 * This ensures the keys of object are equivalent to keys of type.
 * Values of keys are `true` and used only for object creation.
 * 
 * NOTE: This enables `waitFor` dependencies to be specified within each slice.
 */
export type PropertyKeysOf<T> = { [P in keyof Required<T>]: true };