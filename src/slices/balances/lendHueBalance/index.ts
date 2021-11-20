import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { initialState, getGenericReducerBuilder } from '../../'
import { balanceState, tokenBalanceThunk } from '../'
import { ProtocolContract } from '../../contracts'
import getProvider from '../../../utils/getProvider';
import getContract from '../../../utils/getContract';
import { uint256Max } from '../../../utils'
import { LendHue } from '@trustlessfi/typechain'
import { TransactionType } from '../../transactions'
import { ChainID } from '@trustlessfi/addresses'

export type lendHueBalanceArgs = {
  LendHue: string
  Market: string
  TrustlessMulticall: string
  userAddress: string
}

export type lendHueApproveArgs = {
  LendHue: string
  spender: ProtocolContract
  spenderAddress: string
  chainID: ChainID
}

export const getLendHueBalance = createAsyncThunk(
  'lendHueBalance/getLendHueBalance',
  async (args: lendHueBalanceArgs) => tokenBalanceThunk(
    { tokenAddress: args.LendHue, userAddress: args.userAddress, TrustlessMulticall: args.TrustlessMulticall},
    [{contract: ProtocolContract.Market, address: args.Market}],
    [],
  ),
)

export const lendHueBalanceSlice = createSlice({
  name: 'lendHueBalance',
  initialState: initialState as balanceState,
  reducers: {
    clearLendHueBalance: (state) => {
      state.data.value = null
    },
  },
  extraReducers: (builder) => {
    builder = getGenericReducerBuilder(builder, getLendHueBalance)
  },
})

export const { clearLendHueBalance } = lendHueBalanceSlice.actions

export default lendHueBalanceSlice.reducer
