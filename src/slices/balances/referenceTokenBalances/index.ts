import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ProtocolContract } from '../../../utils/protocolContracts'
import { balanceData, getTokenBalanceThunk, getTokenBalanceImpl, fetchTokenBalanceArgs } from '../'
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

    console.log({tokenAddresses: args.tokenAddresses})

    let funcs = args.tokenAddresses.map(async tokenAddress => {
      console.log({tokenAddress})
      const result = await getTokenBalanceImpl(
        {tokenAddress},
        [ProtocolContract.Lend],
        [ProtocolContract.Accounting],
        args.args,
      )
      console.log({result})

      if (result !== null) data[tokenAddress] = result
    })
    console.log({funcs})
    await Promise.all(funcs)
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
