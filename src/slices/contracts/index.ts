import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { executeGetGovernorAlpha , executeGetGovernor , executeGetContract } from './api';
import { sliceState, initialState } from '../'

export enum ProtocolContract {
  Accounting = "Accounting",
  Auctions = "Auctions",
  EnforcedDecentralization = "EnforcedDecentralization",
  Governor = "Governor",
  TCPGovernorAlpha = "TCPGovernorAlpha",
  LendHue = "LendHue",
  Liquidations = "Liquidations",
  Market = "Market",
  HuePositionNFT = "HuePositionNFT",
  Prices = "Prices",
  ProtocolLock = "ProtocolLock",
  Rates = "Rates",
  Rewards = "Rewards",
  Settlement = "Settlement",
  Tcp = "Tcp",
  TcpTimelock = "TcpTimelock",
  Hue = "Hue"
}


export type getContractArgs = {
  governor: string
  contract: ProtocolContract
}

export type getGovernorContractArgs = {
  governorAlpha: string
}

export const getGovernorAlphaContract = createAsyncThunk(
  'contracts/getGovernorAlpha',
  async () => await executeGetGovernorAlpha(),
)

export const getGovernorContract = createAsyncThunk(
  'contracts/getGovernor',
  async (args: getGovernorContractArgs) => await executeGetGovernor(args),
)

export const getContract = createAsyncThunk(
  'contracts/getContract',
  async (args: getContractArgs) => await executeGetContract(args),
)

export type getContractReturnType = { contract: ProtocolContract, address: string }

export type protocolContractsType  = {[key in ProtocolContract]: sliceState<string>}


const contractsInitialState: protocolContractsType = {
  [ProtocolContract.Accounting]: initialState,
  [ProtocolContract.Auctions]:  initialState,
  [ProtocolContract.EnforcedDecentralization]: initialState,
  [ProtocolContract.Governor]: initialState,
  [ProtocolContract.TCPGovernorAlpha]: initialState,
  [ProtocolContract.LendHue]: initialState,
  [ProtocolContract.Liquidations]: initialState,
  [ProtocolContract.Market]: initialState,
  [ProtocolContract.HuePositionNFT]: initialState,
  [ProtocolContract.Prices]: initialState,
  [ProtocolContract.ProtocolLock]: initialState,
  [ProtocolContract.Rates]: initialState,
  [ProtocolContract.Rewards]: initialState,
  [ProtocolContract.Settlement]: initialState,
  [ProtocolContract.Tcp]: initialState,
  [ProtocolContract.TcpTimelock]: initialState,
  [ProtocolContract.Hue]: initialState,
}

const name = 'contracts'

export const contractsSlice = createSlice({
  name,
  initialState: contractsInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getGovernorAlphaContract.pending, (state) => {
        state[ProtocolContract.TCPGovernorAlpha].loading = true
      })
      .addCase(getGovernorAlphaContract.rejected, (state, action) => {
        state[ProtocolContract.TCPGovernorAlpha].loading = false
        state[ProtocolContract.TCPGovernorAlpha].data.error = action.error
      })
      .addCase(getGovernorAlphaContract.fulfilled, (state, action) => {
        state[action.payload.contract].loading = false
        state[action.payload.contract].data.value = action.payload.address
      })

    builder
      .addCase(getGovernorAlphaContract.pending, (state) => {
        state[ProtocolContract.Governor].loading = true
      })
      .addCase(getGovernorAlphaContract.rejected, (state, action) => {
        state[ProtocolContract.Governor].loading = false
        state[ProtocolContract.Governor].data.error = action.error
      })
      .addCase(getGovernorAlphaContract.fulfilled, (state, action) => {
        state[action.payload.contract].loading = false
        state[action.payload.contract].data.value = action.payload.address
      })

    builder
      .addCase(getContract.pending, (state, action) => {
        state[action.meta.arg.contract].loading = true
      })
      // Can't have error due to
      .addCase(getGovernorAlphaContract.fulfilled, (state, action) => {
        state[action.payload.contract].loading = false
        state[action.payload.contract].data.value = action.payload.address
      })
  },
})





export default contractsSlice.reducer
