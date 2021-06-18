import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ethers } from 'ethers';
import { sliceState, nullState } from '../'

export interface ProviderData {
  provider: ethers.providers.Web3Provider
}

export interface ProviderState extends sliceState {
  data: null | ProviderData
}

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.
export const getProvider = createAsyncThunk(
  'provider/getProvider',
  async () => await fetchProvider()
)

export function fetchProvider() {
  return new Promise<ProviderData | null>(async () => {
    if (!window.hasOwnProperty('ethereum') || !window.ethereum) return null

    const provider = (new ethers.providers.Web3Provider(window.ethereum)) as ethers.providers.Web3Provider

    return { provider }
  })
}

const initialState: ProviderState = nullState

export const providerSlice = createSlice({
  name: 'provider',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {},
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  extraReducers: (builder) => {
    builder
      .addCase(getProvider.pending, (state) => {
        state.loading = true
      })
      .addCase(getProvider.rejected, (state, action) => {
        state.loading = false
        state.error = action.error
      })
      .addCase(getProvider.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload;
      });
  },
});

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`

// export const selectCount = (state: RootState) => state.counter.value;

export default providerSlice.reducer;
