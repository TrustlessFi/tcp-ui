import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { initialState, getGenericReducerBuilder } from '../../'
import { balanceState, tokenBalanceThunk } from '../'
import { ProtocolContract } from '../../contracts'
import getProvider from '../../../utils/getProvider';
import getContract from '../../../utils/getContract';
import { Hue } from '@trustlessfi/typechain'
import { uint256Max } from '../../../utils'
import { TransactionType, } from '../../transactions'
import { ChainID } from '@trustlessfi/addresses'

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
  chainID: ChainID
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
  },
})

export const { clearHueBalance } = hueBalanceSlice.actions

export default hueBalanceSlice.reducer
