import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ProtocolContract } from '../../../utils/protocolContracts'
import { balanceData, getTokenBalanceImpl, fetchTokenBalanceArgs } from '../'
import { sliceState, getGenericReducerBuilder, initialState } from '../../'

export interface referenceTokenBalancesArgs {
  tokenAddresses: string[],
  args: fetchTokenBalanceArgs
}

export type referenceTokenBalances = {[key in string]: balanceData}

export interface ReferenceTokenBalancesState extends sliceState<referenceTokenBalances> {}

export const getReferenceTokenBalances = createAsyncThunk(
  'referenceTokenBalances/getReferenceTokenBalances',
  async (args: referenceTokenBalancesArgs) => {
    let data: referenceTokenBalances = {}

    await Promise.all(args.tokenAddresses.map(async tokenAddress => {
      const result = await getTokenBalanceImpl(
        {tokenAddress},
        [ProtocolContract.Lend],
        [ProtocolContract.Accounting],
        args.args,
      )

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
    builder = getGenericReducerBuilder(builder, getReferenceTokenBalances)
  },
});

export default referenceTokenBalanceSlice.reducer;
