import { SerializedError, AsyncThunk } from '@reduxjs/toolkit';
import { ActionReducerMapBuilder } from '@reduxjs/toolkit';

export interface sliceState<T> {
  loading: boolean
  data: {
    error: SerializedError | null,
    value: T | null
  }
}

export const initialState = {
  loading: false,
  data: {
    error: null,
    value: null,
  },
}

export const getGenericReducerBuilder = (
  builder: ActionReducerMapBuilder<any>,
  thunk: AsyncThunk<any, any, {}>,
): ActionReducerMapBuilder<any> => {
  builder
    .addCase(thunk.pending, (state) => {
      state.loading = true
    })
    .addCase(thunk.rejected, (state, action) => {
      state.loading = false
      state.data.error = action.error
    })
    .addCase(thunk.fulfilled, (state, action) => {
      state.loading = false
      state.data.value = action.payload;
    })
  return builder
}
