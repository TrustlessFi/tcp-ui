import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import type { AppDispatch } from './store'
import type { RootState } from '../slices/fetchNodes'

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>()
export type AppSelector = TypedUseSelectorHook<RootState>
export const useAppSelector: AppSelector = useSelector
