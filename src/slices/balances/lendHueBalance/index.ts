import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { initialState, getGenericReducerBuilder } from '../../'
import { balanceState, tokenBalanceThunk, approveToken } from '../'
import { ProtocolContract } from '../../contracts'
import getProvider from '../../../utils/getProvider';
import getContract from '../../../utils/getContract';
import { uint256Max } from '../../../utils'
import { LendHue } from '@trustlessfi/typechain'
import {
  TransactionType,
} from '../../transactions'

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
}

export const getLendHueBalance = createAsyncThunk(
  'lendHueBalance/getLendHueBalance',
  async (args: lendHueBalanceArgs) => tokenBalanceThunk(
    { tokenAddress: args.LendHue, userAddress: args.userAddress, TrustlessMulticall: args.TrustlessMulticall},
    [{contract: ProtocolContract.Market, address: args.Market}],
    [],
  ),
)

export const approveLendHue = createAsyncThunk(
  'lendHueBalance/approveLendHue',
  async (args: lendHueApproveArgs, {dispatch}) => {
    const provider = getProvider()
    // TODO get user address from slice
    const userAddress = await provider.getSigner().getAddress()

    const lendHue = getContract(args.LendHue, ProtocolContract.LendHue) as LendHue

    await approveToken(lendHue, args.spenderAddress, TransactionType.ApproveLendHue, userAddress, dispatch)
  }
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
    builder
      .addCase(approveLendHue.pending, (state, action) => {
        const spendingContract = action.meta.arg.spender
        if (state.data.value !== null && state.data.value.approval[spendingContract] !== undefined) {
          state.data.value.approval[spendingContract]!.approving = true
        }
      })
      .addCase(approveLendHue.rejected, (state, action) => {
        const spendingContract = action.meta.arg.spender
        if (state.data.value !== null && state.data.value.approval[spendingContract] !== undefined) {
          state.data.value.approval[spendingContract]!.approving = false
        }
      })
      .addCase(approveLendHue.fulfilled, (state, action) => {
        const spendingContract = action.meta.arg.spender
        if (state.data.value !== null && state.data.value.approval[spendingContract] !== undefined) {
          state.data.value.approval[spendingContract]!.approving = false
          state.data.value.approval[spendingContract]!.approved = true
          state.data.value.approval[spendingContract]!.allowance = uint256Max
        }
      })
  },
})

export const { clearLendHueBalance } = lendHueBalanceSlice.actions

export default lendHueBalanceSlice.reducer
