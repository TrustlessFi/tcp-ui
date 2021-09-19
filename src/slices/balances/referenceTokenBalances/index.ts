import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { balanceInfo, tokenBalanceThunk } from '../'
import { sliceState, getGenericReducerBuilder, initialState } from '../../'
import { ChainID } from '../../chainID'
import { ProtocolContract } from '../../contracts/index';

export interface referenceTokenBalancesArgs {
  tokenAddresses: string[],
  chainID: ChainID,
  userAddress: string,
  Market: string,
  Accounting: string,
}

export type referenceTokenBalances = {[key in string]: balanceInfo}

export interface ReferenceTokenBalancesState extends sliceState<referenceTokenBalances> {}

export const getReferenceTokenBalances = createAsyncThunk(
  'referenceTokenBalances/getReferenceTokenBalances',
  async (args: referenceTokenBalancesArgs) => {
    let data: referenceTokenBalances = {}

    await Promise.all(args.tokenAddresses.map(async tokenAddress => {
      const result = await tokenBalanceThunk(
        {tokenAddress, userAddress: args.userAddress},
        [{contract: ProtocolContract.Market, address: args.Market}],
        [{contract: ProtocolContract.Accounting, address: args.Accounting}],
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
