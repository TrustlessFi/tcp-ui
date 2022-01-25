import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import { RootState } from '../slices/fetchNodes'
import allSlices from '../slices/allSlices'

export const store = configureStore({
  reducer:
    Object.fromEntries(
      Object.entries(allSlices)
        .map(
          ([name, slice]) => [name, slice.slice.reducer])
        ) as {[sliceName in keyof typeof allSlices]: (typeof allSlices)[sliceName]['slice']['reducer']}
})

export type AppDispatch = typeof store.dispatch
// type RootState = ReturnType<typeof store.getState> // NOTE: now defined in slices/fetchNodes.ts
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>
