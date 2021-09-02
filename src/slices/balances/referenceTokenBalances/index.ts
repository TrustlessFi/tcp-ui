import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ProtocolContract } from '../../../utils/protocolContracts'
import { balanceInfo, getTokenBalanceImpl } from '../'
import { sliceState, getGenericReducerBuilder, initialState } from '../../'
import { ChainID } from '../../chainID'

export interface referenceTokenBalancesArgs {
  tokenAddresses: string[],
  chainID: ChainID,
  userAddress: string,
}

export type referenceTokenBalances = {[key in string]: balanceInfo}

export interface ReferenceTokenBalancesState extends sliceState<referenceTokenBalances> {}

export const getReferenceTokenBalances = createAsyncThunk(
  'referenceTokenBalances/getReferenceTokenBalances',
  async (args: referenceTokenBalancesArgs) => {
    let data: referenceTokenBalances = {}

    await Promise.all(args.tokenAddresses.map(async tokenAddress => {
      const result = await getTokenBalanceImpl(
        {tokenAddress},
        [ProtocolContract.Market],
        [ProtocolContract.Accounting],
        { chainID: args.chainID, userAddress: args.userAddress },
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
