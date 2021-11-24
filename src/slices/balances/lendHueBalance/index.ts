import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { initialState, getGenericReducerBuilder } from '../../'
import { balanceState, tokenBalanceThunk } from '../'
import { ProtocolContract, ContractsInfo } from '../../contracts'
import { ChainID } from '@trustlessfi/addresses'

export type lendHueBalanceArgs = {
  contracts: ContractsInfo
  trustlessMulticall: string
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
    { tokenAddress: args.contracts[ProtocolContract.LendHue], userAddress: args.userAddress, trustlessMulticall: args.trustlessMulticall},
    [{contract: ProtocolContract.Market, address: args.contracts[ProtocolContract.Market]}],
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
