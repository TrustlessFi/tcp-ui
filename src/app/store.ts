import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import { allSlices, RootState } from '../slices/fetchNodes'

export const store = configureStore({
  reducer:
    Object.fromEntries(
      Object.entries(allSlices)
        .map(
          ([name, slice]) => [name, slice.slice.reducer])
        ) as {[sliceName in keyof typeof allSlices]: (typeof allSlices)[sliceName]['slice']['reducer']}
})

export type AppDispatch = typeof store.dispatch
// TODO change to fetchNodes root state
// type RootState = ReturnType<typeof store.getState> // NOTE: defined in slices/fetchNodes.ts
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>
