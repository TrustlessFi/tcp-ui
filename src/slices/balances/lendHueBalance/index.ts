import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { initialState, getGenericReducerBuilder } from '../../'
import { balanceState, tokenBalanceThunk } from '../'
import { ProtocolContract } from '../../contracts'
import getProvider from '../../../utils/getProvider';
import getContract from '../../../utils/getContract';
import { uint256Max } from '../../../utils'
import { LendHue } from '../../../utils/typechain'
import {
  getTxInfo,
  TransactionStatus,
  TransactionType,
  transactionCreated,
  transactionSucceeded,
  transactionFailed
} from '../../transactions'
import {
  addNotification,
} from '../../notifications'

export type lendHueBalanceArgs = {
  LendHue: string
  Market: string
  TcpMulticall: string
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
    { tokenAddress: args.LendHue, userAddress: args.userAddress, TcpMulticall: args.TcpMulticall},
    [{contract: ProtocolContract.Market, address: args.Market}],
    [],
  ),
)

export const approveLendHue = createAsyncThunk(
  'lendHueBalance/approveLendHue',
  async (args: lendHueApproveArgs, {dispatch}) => {
    const provider = getProvider()
    const userAddress = await provider.getSigner().getAddress()

    const lendHue = getContract(args.LendHue, ProtocolContract.LendHue) as LendHue
    const tx = await lendHue.connect(provider.getSigner()).approve(args.spenderAddress, uint256Max)

    const txInfo = getTxInfo({
      hash: tx.hash,
      userAddress,
      nonce: tx.nonce,
      type: TransactionType.ApproveLendHue,
      status: TransactionStatus.Pending,
    })

    dispatch(transactionCreated(txInfo))

    const receipt = await provider.waitForTransaction(tx.hash)
    const succeeded = receipt.status === 1

    if (succeeded) {
      dispatch(addNotification({ ...txInfo, status: TransactionStatus.Success }))
      dispatch(transactionSucceeded(tx.hash))
    } else {
      dispatch(addNotification({ ...txInfo, status: TransactionStatus.Failure }))
      dispatch(transactionFailed(tx.hash))
    }
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
