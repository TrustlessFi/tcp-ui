import { createLocalSlice, CacheDuration } from '../'
import { RootState } from '../fetchNodes'

export interface cacheBreakerState {
  cacheIndex: number
}

export const cacheIndex = 2

const initialState = { cacheIndex } as cacheBreakerState

const cacheBreakerSlice = createLocalSlice({
  name: 'cacheBreaker',
  initialState,
  stateSelector: (state: RootState) => state.cacheBreaker,
  cacheDuration: CacheDuration.INFINITE,
  reducers: {},
})


export default cacheBreakerSlice
