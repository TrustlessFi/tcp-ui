import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { initialState, getGenericReducerBuilder } from '../../'
import { balanceState, tokenBalanceThunk, approveToken } from '../'
import { ProtocolContract } from '../../contracts'
import getProvider from '../../../utils/getProvider';
import getContract from '../../../utils/getContract';
import { Hue } from '@trustlessfi/typechain'
import { uint256Max } from '../../../utils'
import { TransactionType, } from '../../transactions'

export type hueBalanceArgs = {
  Hue: string
  Market: string
  Accounting: string
  TrustlessMulticall: string
  userAddress: string
}

export type hueApproveArgs = {
  Hue: string
  spender: ProtocolContract
  spenderAddress: string
}

export const getHueBalance = createAsyncThunk(
  'hueBalance/getHueBalance',
  async (args: hueBalanceArgs) => tokenBalanceThunk(
    { tokenAddress: args.Hue, userAddress: args.userAddress, TrustlessMulticall: args.TrustlessMulticall},
    [{contract: ProtocolContract.Market, address: args.Market}],
    [
      {contract: ProtocolContract.Hue, address: args.Hue},
      {contract: ProtocolContract.Accounting, address: args.Accounting},
    ],
  ),
)

export const approveHue = createAsyncThunk(
  'hueBalance/approveHue',
  async (args: hueApproveArgs, {dispatch}) => {
    const provider = getProvider()
    // TODO pull from data
    const userAddress = await provider.getSigner().getAddress()

    const hue = getContract(args.Hue, ProtocolContract.Hue) as Hue

    await approveToken(hue, args.spenderAddress, TransactionType.ApproveHue, userAddress, dispatch)
  }
)

export const hueBalanceSlice = createSlice({
  name: 'hueBalance',
  initialState: initialState as balanceState,
  reducers: {
    clearHueBalance: (state) => {
      state.data.value = null
    },
  },
  extraReducers: (builder) => {
    builder = getGenericReducerBuilder(builder, getHueBalance)

    return builder
      .addCase(approveHue.pending, (state, action) => {
        const spendingContract = action.meta.arg.spender
        if (state.data.value !== null && state.data.value.approval[spendingContract] !== undefined) {
          state.data.value.approval[spendingContract]!.approving = true
        }
      })
      .addCase(approveHue.rejected, (state, action) => {
        const spendingContract = action.meta.arg.spender
        if (state.data.value !== null && state.data.value.approval[spendingContract] !== undefined) {
          state.data.value.approval[spendingContract]!.approving = false
        }
      })
      .addCase(approveHue.fulfilled, (state, action) => {
        const spendingContract = action.meta.arg.spender
        if (state.data.value !== null && state.data.value.approval[spendingContract] !== undefined) {
          state.data.value.approval[spendingContract]!.approving = false
          state.data.value.approval[spendingContract]!.approved = true
          state.data.value.approval[spendingContract]!.allowance = uint256Max
        }
      })
  },
})

export const { clearHueBalance } = hueBalanceSlice.actions

export default hueBalanceSlice.reducer
