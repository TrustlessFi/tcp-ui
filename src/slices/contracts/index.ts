import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { sliceState, initialState } from '../'
import { ChainID } from '@trustlessfi/addresses'
import { Governor } from '@trustlessfi/typechain'
import { getLocalStorage } from '../../utils'
import { getGenericReducerBuilder } from '../index';
import { getMulticallContract } from '../../utils/getContract';
import { executeMulticall, rc } from '@trustlessfi/multicall'
import getContract from '../../utils/getContract';

// TODO add TCP Allocation
export enum ProtocolContract {
  Accounting = "Accounting",
  Auctions = "Auctions",
  EnforcedDecentralization = "EnforcedDecentralization",
  Hue = "Hue",
  HuePositionNFT = "HuePositionNFT",
  LendHue = "LendHue",
  Liquidations = "Liquidations",
  Market = "Market",
  Prices = "Prices",
  ProtocolLock = "ProtocolLock",
  Rates = "Rates",
  Rewards = "Rewards",
  Settlement = "Settlement",
  Tcp = "Tcp",
  TcpGovernorAlpha = "TcpGovernorAlpha",
  TcpTimelock = "TcpTimelock",
}

export enum RootContract {
  Governor = "Governor",
  ProtocolDataAggregator = "ProtocolDataAggregator",
  TrustlessMulticall = "TrustlessMulticall",
}

export interface contractsArgs {
  governor: string
  trustlessMulticall: string
}

export const getContracts = createAsyncThunk(
  'contracts/getContracts',
  async (args: contractsArgs): Promise<ContractsInfo> => {
    const trustlessMulticall = getMulticallContract(args.trustlessMulticall)
    const governor = getContract(args.governor, RootContract.Governor) as Governor

    const result =  (await executeMulticall(
      trustlessMulticall,
      governor,
      {
        accounting: rc.String,
        auctions: rc.String,
        tcp: rc.String,
        hue: rc.String,
        huePositionNFT: rc.String,
        enforcedDecentralization: rc.String,
        lendHue: rc.String,
        liquidations: rc.String,
        market: rc.String,
        prices: rc.String,
        protocolLock: rc.String,
        rates: rc.String,
        rewards: rc.String,
        settlement: rc.String,
        timelock: rc.String,
        governorAlpha: rc.String,
        tcpAllocation: rc.String,
      },
    ))

    return {
      [ProtocolContract.Accounting]: result.accounting,
      [ProtocolContract.Auctions]: result.auctions,
      [ProtocolContract.EnforcedDecentralization]: result.enforcedDecentralization,
      [ProtocolContract.Hue]: result.hue,
      [ProtocolContract.HuePositionNFT]: result.huePositionNFT,
      [ProtocolContract.LendHue]: result.lendHue,
      [ProtocolContract.Liquidations]: result.liquidations,
      [ProtocolContract.Market]: result.market,
      [ProtocolContract.Prices]: result.prices,
      [ProtocolContract.ProtocolLock]: result.protocolLock,
      [ProtocolContract.Rates]: result.rates,
      [ProtocolContract.Rewards]: result.rewards,
      [ProtocolContract.Settlement]: result.settlement,
      [ProtocolContract.Tcp]: result.tcp,
      [ProtocolContract.TcpGovernorAlpha]: result.governorAlpha,
      [ProtocolContract.TcpTimelock]: result.timelock,
    }
  }
)

export type ContractsInfo = {[key in ProtocolContract]: string}

export interface ContractsState extends sliceState<ContractsInfo> {}

const name = 'contracts'

export const contractsSlice = createSlice({
  name,
  initialState: getLocalStorage(name, initialState) as ContractsState,
  reducers: {},
  extraReducers: (builder) => {
    builder = getGenericReducerBuilder(builder, getContracts)
  }
})

export default contractsSlice.reducer
