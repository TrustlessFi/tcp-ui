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
import { FetchNode, thunkDependencies, getThunkDependencies, RootState } from './fetchNodes'

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

export enum SliceDataType {
  ChainData,
  Local,
}

const getCacheDuration = (cacheDuration?: CacheDuration) =>
  cacheDuration === undefined
  ? CacheDuration.SHORT
  : cacheDuration


export const createChainDataSlice = <
  Value,
  dependencyNodes extends FetchNode,
  dependencies extends thunkDependencies<dependencyNodes>,
  stateSelector extends (state: RootState) => sliceState<Value>,
  Args extends NonNullValues<dependencies>,
  reducers extends SliceCaseReducers<sliceState<Value>>,
  SliceType extends Slice<sliceState<Value>, {[reducer in keyof reducers]: reducers[reducer]}>,
>(
  sliceData: {
    name: string,
    dependencies: dependencyNodes[],
    stateSelector: stateSelector,
    thunkFunction: (args: Args) => Promise<Value>
    reducers?: reducers
    cacheDuration?: CacheDuration
  }
): {
  name: string,
  slice: SliceType,
  stateSelector: stateSelector,
  thunk: AsyncThunk<Value, Args, {}>
  dependencies: dependencies,
  cacheDuration: CacheDuration,
  sliceType: SliceDataType.ChainData,
} => {
  const { name, dependencies, thunkFunction, stateSelector } = sliceData
  const cacheDuration = getCacheDuration(sliceData.cacheDuration)
  const reducers = sliceData.reducers === undefined ? {} : sliceData.reducers

  const thunk = createAsyncThunk(`${sliceData.name}/fetch_${sliceData.name}`, thunkFunction)

  return {
    name,
    stateSelector,
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
    sliceType: SliceDataType.ChainData,
  }
}

export const createLocalSlice = <
  Value,
  stateSelector extends (state: RootState) => Value | null,
  reducers extends SliceCaseReducers<Value>,
  SliceType extends Slice<Value, {[reducer in keyof reducers]: reducers[reducer]}>,
>(
  sliceData: {
    name: string,
    initialState: Value,
    stateSelector: stateSelector
    reducers?: reducers
    cacheDuration?: CacheDuration
  }
): {
  name: string,
  slice: SliceType,
  stateSelector: stateSelector,
  cacheDuration: CacheDuration,
  sliceType: SliceDataType.Local,
} => {
  const { name, initialState, stateSelector } = sliceData
  const cacheDuration = sliceData.cacheDuration === undefined ? CacheDuration.SHORT : sliceData.cacheDuration
  const reducers = sliceData.reducers === undefined ? {} : sliceData.reducers

  return {
    name,
    stateSelector,
    slice: createSlice({
      name,
      initialState:
        (cacheDuration === CacheDuration.NONE
          ? initialState
          : getLocalStorageState(name, initialState)),
      reducers,
    }) as SliceType,
    cacheDuration,
    sliceType: SliceDataType.Local,
  }
}
