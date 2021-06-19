import { SerializedError, AsyncThunk } from '@reduxjs/toolkit';
import { ActionReducerMapBuilder } from '@reduxjs/toolkit';

export interface sliceState {
  loading: boolean
  error: SerializedError | null
  data: any | null
}

export const nullState = {
  loading: false,
  error: null,
  data: null,
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
      state.error = action.error
    })
    .addCase(thunk.fulfilled, (state, action) => {
      state.loading = false
      state.data = action.payload;
    });

  return builder
}

export const idle = (state: sliceState) => state.data === null && !state.loading
