import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { sliceState, initialState } from '../'
import { getGenericReducerBuilder } from '../'
import { unscale } from '../../utils'
import { getMulticallContract } from '../../utils/getContract'

export type ethBalance = number

export interface EthBalanceState extends sliceState<ethBalance> {}


export type ethBalanceArgs = {
  userAddress: string,
  TrustlessMulticall: string,
}

export const fetchEthBalance = createAsyncThunk(
  'ethBalance/fetchEthBalance',
  async (args: ethBalanceArgs) => {
    const trustlessMulticall = getMulticallContract(args.TrustlessMulticall)

    return unscale(await trustlessMulticall.getEthBalance(args.userAddress))
  }
)

export const ethBalanceSlice = createSlice({
  name: 'ethBalance',
  initialState: initialState as EthBalanceState,
  reducers: {
    clearEthBalance: (state) => {
      state.data.value = null
    },
  },
  extraReducers: (builder) => {
    builder = getGenericReducerBuilder(builder, fetchEthBalance)
  },
})

export const { clearEthBalance } = ethBalanceSlice.actions

export default ethBalanceSlice.reducer
