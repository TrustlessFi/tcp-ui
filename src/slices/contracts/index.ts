import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { sliceState, initialState } from '../'
import { Governor } from '@trustlessfi/typechain'
import { getLocalStorage } from '../../utils'
import { getGenericReducerBuilder } from '../index';
import { getMulticallContract } from '../../utils/getContract';
import { executeMulticalls, oneContractManyFunctionMC, rc } from '@trustlessfi/multicall'
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

    const { contracts } = await executeMulticalls(
      trustlessMulticall,
      {
        contracts: oneContractManyFunctionMC(
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
          }
        )
      }
    )

    return {
      [ProtocolContract.Accounting]: contracts.accounting,
      [ProtocolContract.Auctions]: contracts.auctions,
      [ProtocolContract.EnforcedDecentralization]: contracts.enforcedDecentralization,
      [ProtocolContract.Hue]: contracts.hue,
      [ProtocolContract.HuePositionNFT]: contracts.huePositionNFT,
      [ProtocolContract.LendHue]: contracts.lendHue,
      [ProtocolContract.Liquidations]: contracts.liquidations,
      [ProtocolContract.Market]: contracts.market,
      [ProtocolContract.Prices]: contracts.prices,
      [ProtocolContract.ProtocolLock]: contracts.protocolLock,
      [ProtocolContract.Rates]: contracts.rates,
      [ProtocolContract.Rewards]: contracts.rewards,
      [ProtocolContract.Settlement]: contracts.settlement,
      [ProtocolContract.Tcp]: contracts.tcp,
      [ProtocolContract.TcpGovernorAlpha]: contracts.governorAlpha,
      [ProtocolContract.TcpTimelock]: contracts.timelock,
    }
  }
)

export type ContractsInfo = { [key in ProtocolContract]: string }

export interface ContractsState extends sliceState<ContractsInfo> { }

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
