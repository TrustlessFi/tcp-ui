import {
  SerializedError,
  AsyncThunk,
  ActionReducerMapBuilder,
  createAsyncThunk,
  createSlice,
  SliceCaseReducers,
  Slice,
} from '@reduxjs/toolkit'
import { timeS, minutes } from '../utils'
import { FetchNode, thunkDependencies, getThunkDependencies } from './fetchNodes'

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
  thunk: AsyncThunk<Value, Args, {}>,
): ActionReducerMapBuilder<sliceState<Value>> =>
  builder
    .addCase(thunk.pending, (state) => {
      state.loading = true
    })
    .addCase(thunk.rejected, (state, action) => {
      state.loading = false
      state.error = action.error
    })
    .addCase(thunk.fulfilled, (_state, action) => {
      return getStateWithValue(action.payload)
    })

export enum CacheDuration {
  INFINITE = -1,
  NONE = 0,
  SHORT = minutes(2),
  LONG = minutes(30),
}

export const createChainDataSlice = <
  Value,
  dependencyNodes extends FetchNode,
  dependencies extends thunkDependencies<dependencyNodes>,
  Args extends NonNullValues<dependencies>,
  reducers extends SliceCaseReducers<sliceState<Value>>,
  SliceType extends Slice<sliceState<Value>, {[reducer in keyof reducers]: reducers[reducer]}>,
>(
  sliceData: {
    name: string,
    dependencies: dependencyNodes[],
    thunkFunction: (args: Args) => Promise<Value>
    reducers?: reducers
    cacheDuration?: CacheDuration
  }
): {
  name: string,
  slice: SliceType,
  thunk: AsyncThunk<Value, Args, {}>
  dependencies: dependencies,
  cacheDuration: CacheDuration,
} => {
  const { name, dependencies, thunkFunction } = sliceData
  const cacheDuration = sliceData.cacheDuration === undefined ? CacheDuration.NONE : sliceData.cacheDuration
  const reducers = sliceData.reducers === undefined ? {} : sliceData.reducers

  const thunk = createAsyncThunk(`${sliceData.name}/fetch_${sliceData.name}`, thunkFunction)

  return {
    name,
    slice: createSlice({
      name,
      initialState:
        (cacheDuration === CacheDuration.NONE
          ? getStateWithValue<Value>(null)
          : getLocalStorageSliceState<Value>(name)),
      reducers,
      extraReducers: (builder) => {
        builder = getGenericReducerBuilder<Args, Value>(builder, thunk)
      },
    }) as SliceType,
    thunk,
    dependencies: getThunkDependencies(dependencies) as dependencies,
    cacheDuration,
  }
}

export const createLocalSlice = <
  Value,
  reducers extends SliceCaseReducers<Value>,
  SliceType extends Slice<Value, {[reducer in keyof reducers]: reducers[reducer]}>,
>(
  sliceData: {
    name: string,
    initialState: Value,
    reducers?: reducers
    cacheDuration?: CacheDuration
  }
): {
  name: string,
  slice: SliceType,
  cacheDuration: CacheDuration,
} => {
  const { name, initialState } = sliceData
  const cacheDuration = sliceData.cacheDuration === undefined ? CacheDuration.NONE : sliceData.cacheDuration
  const reducers = sliceData.reducers === undefined ? {} : sliceData.reducers

  return {
    name,
    slice: createSlice({
      name,
      initialState:
        (cacheDuration === CacheDuration.NONE
          ? initialState
          : getLocalStorageState(name, initialState)),
      reducers,
    }) as SliceType,
    cacheDuration,
  }
}
