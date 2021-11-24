import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { initialState, getGenericReducerBuilder } from '../../'
import { balanceState, tokenBalanceThunk } from '../'
import { ProtocolContract, ContractsInfo } from '../../contracts'
import { ChainID } from '@trustlessfi/addresses'

export type hueBalanceArgs = {
  contracts: ContractsInfo
  trustlessMulticall: string
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
    { tokenAddress: args.contracts[ProtocolContract.Hue], userAddress: args.userAddress, trustlessMulticall: args.trustlessMulticall},
    [{contract: ProtocolContract.Market, address: args.contracts[ProtocolContract.Market]}],
    [
      {contract: ProtocolContract.Hue, address: args.contracts[ProtocolContract.Hue]},
      {contract: ProtocolContract.Accounting, address: args.contracts[ProtocolContract.Accounting]},
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
