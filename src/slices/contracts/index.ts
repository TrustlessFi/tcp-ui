import { AsyncThunk, Draft } from '@reduxjs/toolkit'
import { ActionReducerMapBuilder } from '@reduxjs/toolkit'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { executeGetGovernor, executeGetContract } from './api'
import { sliceState, initialState } from '../'
import { ChainID } from '../chainID/index'
import { getLocalStorage } from '../../utils'

export enum ProtocolContract {
  Accounting = "Accounting",
  Auctions = "Auctions",
  EnforcedDecentralization = "EnforcedDecentralization",
  Hue = "Hue",
  HuePositionNFT = "HuePositionNFT",
  Governor = "Governor",
  LendHue = "LendHue",
  Liquidations = "Liquidations",
  Market = "Market",
  Prices = "Prices",
  ProtocolLock = "ProtocolLock",
  Rates = "Rates",
  Rewards = "Rewards",
  Settlement = "Settlement",
  Tcp = "Tcp",
  TCPGovernorAlpha = "TCPGovernorAlpha",
  TcpTimelock = "TcpTimelock",
}

export type getGovernorContractArgs = {
  chainID: ChainID
}

export type getContractArgs = {
  Governor: string
  contract: ProtocolContract
}

export const getGovernorContract = createAsyncThunk(
  'contracts/getGovernor',
  async (args: getGovernorContractArgs) => await executeGetGovernor(args),
)

export const getContractThunk = (contract: ProtocolContract) => {
  return createAsyncThunk(
    'contracts/get' + contract,
    async (args: getContractArgs) => await executeGetContract({ ...args, contract }),
  )
}

export type getContractReturnType = string // { contract: ProtocolContract, address: string } TODO delete

export type ProtocolContractsState  = {[key in ProtocolContract]: sliceState<getContractReturnType>}

const contractsInitialState: ProtocolContractsState = {
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

export const getContractGenericReducerBuilder = <Args extends {}>(
  builder: ActionReducerMapBuilder<ProtocolContractsState>,
  thunk: AsyncThunk<Draft<string>, Args, {}>,
  contract: ProtocolContract
): ActionReducerMapBuilder<ProtocolContractsState> =>  {
  return builder
    .addCase(thunk.pending, (state) => {
      state[contract].loading = true
    })
    .addCase(thunk.rejected, (state, action) => {
      state[contract].loading = false
      state[contract].data.error = action.error
    })
    .addCase(thunk.fulfilled, (state, action) => {
      state[contract].loading = false
      state[contract].data.value = action.payload
    })
}

const name = 'contracts'

export const contractsSlice = createSlice({
  name,
  initialState: getLocalStorage(name, contractsInitialState) as ProtocolContractsState,
  reducers: {},
  extraReducers: (builder) => {
    for (const contractString in ProtocolContract) {
      const contract = contractString as ProtocolContract

      if (contract === ProtocolContract.Governor) {
        builder = getContractGenericReducerBuilder<getGovernorContractArgs>(builder, getGovernorContract, contract)
      } else {
        builder = getContractGenericReducerBuilder<getContractArgs>(builder, getContractThunk(contract), contract)
      }
    }
  }
})

export default contractsSlice.reducer
