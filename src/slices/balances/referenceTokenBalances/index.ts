import { SerializedError } from '@reduxjs/toolkit';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ProtocolContract } from '../../../utils/protocolContracts'
import { balanceData, getTokenBalanceThunk, fetchTokenBalanceArgs } from '../'
import { sliceState, getGenericReducerBuilder, initialState } from '../../'

export interface externalTokenBalancesArgs {
  tokenAddresses: string[],
  args: fetchTokenBalanceArgs
}

export type ReferenceTokenBalancesData = {[key in string]: balanceData}

export interface ReferenceTokenBalancesState extends sliceState {
  data: ReferenceTokenBalancesData | null
}

export const getReferenceTokenBalances = createAsyncThunk(
  'referenceTokenBalances/getReferenceTokenBalances',
  async (args: externalTokenBalancesArgs) => {
    let data: ReferenceTokenBalancesData = {}
    await Promise.all(args.tokenAddresses.map(async tokenAddress => {
      const result = await getTokenBalanceThunk(
        {tokenAddress},
        [ProtocolContract.Lend],
        [ProtocolContract.Accounting]
      )(args.args)
      if (result !== null) data[tokenAddress] = result
    }))
    return data
  }
)

export const referenceTokenBalanceSlice = createSlice({
  name: 'referenceTokenBalances',
  initialState: initialState as ReferenceTokenBalancesState,
  reducers: {},
  extraReducers: (builder) => {
    // builder = getGenericReducerBuilder(builder, getReferenceTokenBalances)
  builder
    .addCase(getReferenceTokenBalances.pending, (state) => {
      state.loading = true
    })
    .addCase(getReferenceTokenBalances.rejected, (state, action) => {
      state.loading = false
      state.error = action.error
    })
    .addCase(getReferenceTokenBalances.fulfilled, (state, action) => {
      state.loading = false
      state.data = action.payload;
    });
  },
});

export default referenceTokenBalanceSlice.reducer;
